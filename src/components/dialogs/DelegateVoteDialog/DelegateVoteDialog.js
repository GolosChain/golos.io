import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';

import { parseAmount } from 'helpers/currency';
import { processError } from 'helpers/dialogs';
import { displaySuccess } from 'utils/toastMessages';
import { Link } from 'shared/routes';

import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';

import { CURRENCIES } from 'shared/constants';

const DialogFrameStyled = styled(DialogFrame)`
  flex-basis: 616px;

  @media (max-width: 640px) {
    flex-basis: 340px;
  }
`;

const Content = styled.div`
  padding: 5px 30px 14px;
`;

const SubHeader = styled.div`
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
  color: #959595;
`;

const Body = styled.div`
  display: flex;
  margin: 0 -10px;
  justify-content: center;
`;

const Section = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  margin: 19px 0 9px;
  font-size: 14px;
`;

const ErrorBlock = styled.div`
  min-height: 25px;
`;

const ErrorLine = styled.div`
  color: #ff4641;
  animation: fade-in 0.15s;
`;

export default class DelegateVoteDialog extends PureComponent {
  static propTypes = {
    recipientName: PropTypes.string.isRequired,
    recipientUsername: PropTypes.string.isRequired,
    amount: PropTypes.string,

    stakedBalance: PropTypes.number.isRequired,

    onClose: PropTypes.func.isRequired,
    delegateVote: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    let recipientName = '';

    if (props.recipientName) {
      recipientName = props.recipientName;
    }

    let amount = '';

    if (props.amount) {
      amount = props.amount;
    }

    this.state = {
      recipientName,
      amount,
      currency: CURRENCIES.CYBER.id,
      amountInFocus: false,
      loader: false,
      disabled: false,
    };
  }

  onAmountChange = e => {
    this.setState({
      amount: e.target.value.replace(/[^\d .]+/g, '').replace(/,/g, '.'),
    });
  };

  onAmountFocus = () => {
    this.setState({
      amountInFocus: true,
    });
  };

  onAmountBlur = () => {
    this.setState({
      amountInFocus: false,
    });
  };

  onCloseClick = () => {
    const { onClose } = this.props;
    onClose();
  };

  onOkClick = async () => {
    const { delegateVote, onClose } = this.props;
    const { recipientName, amount, currency, loader, disabled } = this.state;

    if (loader || disabled) {
      return;
    }

    const tokensAmount = parseFloat(amount.replace(/\s+/, '')).toFixed(CURRENCIES[currency].decs);

    this.setState({
      loader: true,
    });

    try {
      await delegateVote(recipientName, `${tokensAmount} ${currency}`);
      displaySuccess(tt('dialogs_transfer.delegatevote.transfer_success'));
      this.unblockDialog();
      onClose();
    } catch (err) {
      this.unblockDialog();
      processError(err);
    }
  };

  confirmClose() {
    const { onClose } = this.props;
    const { recipientName, amount } = this.state;

    if (recipientName || amount.trim()) {
      DialogManager.dangerConfirm(tt('dialogs_transfer.confirm_dialog_close')).then(y => {
        if (y) {
          onClose();
        }
      });

      return false;
    }
    return true;
  }

  unblockDialog() {
    this.setState({
      loader: false,
      disabled: false,
    });
  }

  render() {
    const { stakedBalance, recipientUsername } = this.props;
    const { recipientName, amount, currency, loader, disabled, amountInFocus } = this.state;

    const buttons = [
      {
        id: CURRENCIES.CYBER.id,
        title: 'CYBER',
      },
    ];

    const { value, error } = parseAmount(amount, {
      balance: stakedBalance,
      isFinal: !amountInFocus,
      decs: CURRENCIES[currency].decs,
    });

    const allow = recipientName && value > 0 && !error && !loader && !disabled;

    return (
      <DialogFrameStyled
        title={
          <span>
            {tt('dialogs_transfer.delegatevote.title')}{' '}
            <Link route="profile" params={{ userId: recipientUsername }}>
              {recipientUsername}
            </Link>
          </span>
        }
        titleSize={20}
        icon="coins"
        buttons={[
          {
            text: tt('g.cancel'),
            onClick: this.onCloseClick,
          },
          {
            text: tt('dialogs_transfer.delegatevote.transfer_button'),
            primary: true,
            disabled: !allow,
            onClick: this.onOkClick,
          },
        ]}
        onCloseClick={this.onCloseClick}
      >
        <Content>
          <SubHeader>{tt('dialogs_transfer.delegatevote.tip')}</SubHeader>
          <Body>
            <Section>
              <Label>{tt('dialogs_transfer.amount')}</Label>
              <ComplexInput
                placeholder={tt('dialogs_transfer.amount_placeholder', {
                  amount: stakedBalance.toFixed(CURRENCIES[currency].decs),
                })}
                spellCheck="false"
                value={amount}
                autoFocus
                activeId={currency}
                buttons={buttons}
                onChange={this.onAmountChange}
                onFocus={this.onAmountFocus}
                onBlur={this.onAmountBlur}
              />
            </Section>
          </Body>
          <ErrorBlock>{error ? <ErrorLine>{error}</ErrorLine> : null}</ErrorBlock>
        </Content>
        {loader ? <SplashLoader /> : null}
      </DialogFrameStyled>
    );
  }
}
