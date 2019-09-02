import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { parseAmount } from 'helpers/currency';
import { displaySuccess, displayError } from 'utils/toastMessages';
import { Link } from 'shared/routes';
import { CURRENCIES } from 'shared/constants';

import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';
import Slider from 'components/golos-ui/Slider';
import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';

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

const SectionSlider = styled.div`
  width: 50%;
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

const SliderWrapper = styled.div`
  margin-bottom: 3px;
`;

const RecallAmount = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export default class DelegateVoteDialog extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    recipientName: PropTypes.string.isRequired,
    recipientUsername: PropTypes.string.isRequired,
    hint: PropTypes.string,

    stakedBalance: PropTypes.number.isRequired,

    close: PropTypes.func.isRequired,
    delegateVote: PropTypes.func.isRequired,
    recallvote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    type: 'delegatevote',
    hint: null,
  };

  constructor(props) {
    super(props);

    let recipientName = '';
    if (props.recipientName) {
      recipientName = props.recipientName;
    }

    this.state = {
      recipientName,
      amount: '',
      recallAmount: 1,
      recallPercent: 1,
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
    const { close } = this.props;
    close();
  };

  onOkClick = async () => {
    const { type, delegateVote, recallvote, close } = this.props;
    const { recipientName, amount, recallPercent, currency, loader, disabled } = this.state;

    if (loader || disabled) {
      return;
    }

    const tokensAmount = parseFloat(amount.replace(/\s+/, '')).toFixed(CURRENCIES[currency].decs);

    this.setState({
      loader: true,
    });

    try {
      if (type === 'recallvote') {
        await recallvote(recipientName, currency, recallPercent);
      } else {
        await delegateVote(recipientName, `${tokensAmount} ${currency}`);
      }
      displaySuccess(tt(`dialogs_transfer.delegatevote.success_${type}`));
      this.unblockDialog();
      close();
    } catch (err) {
      this.unblockDialog();
      displayError(tt(`dialogs_transfer.delegatevote.failed_${type}`), err);
    }
  };

  onSliderChange = value => {
    const { stakedBalance } = this.props;

    this.setState({
      recallAmount: value,
      recallPercent: Math.round((value / 10000 / stakedBalance) * 100),
    });
  };

  canSend = () => {
    const { type, stakedBalance } = this.props;
    const {
      recipientName,
      amount,
      recallPercent,
      currency,
      loader,
      disabled,
      amountInFocus,
    } = this.state;

    const { value, error } = parseAmount(amount, {
      balance: stakedBalance,
      isFinal: !amountInFocus,
      decs: CURRENCIES[currency].decs,
    });

    if (error || loader || disabled) {
      return false;
    }

    if (!recipientName) {
      return false;
    }

    if (type === 'delegatevote') {
      return value > 0;
    }

    if (type === 'recallvote') {
      return recallPercent >= 1 && recallPercent <= 100;
    }

    return false;
  };

  unblockDialog() {
    this.setState({
      loader: false,
      disabled: false,
    });
  }

  confirmClose() {
    const { close } = this.props;
    const { recipientName, amount } = this.state;

    if (recipientName || amount.trim()) {
      DialogManager.dangerConfirm(tt('dialogs_transfer.confirm_dialog_close')).then(y => {
        if (y) {
          close();
        }
      });

      return false;
    }
    return true;
  }

  render() {
    const { type, stakedBalance, recipientUsername, hint } = this.props;
    const { amount, recallAmount, currency, loader, amountInFocus } = this.state;

    const buttons = [
      {
        id: CURRENCIES.CYBER.id,
        title: 'CYBER',
      },
    ];

    const { error } = parseAmount(amount, {
      balance: stakedBalance,
      isFinal: !amountInFocus,
      decs: CURRENCIES[currency].decs,
    });

    return (
      <DialogFrameStyled
        title={
          <span>
            {tt(`dialogs_transfer.delegatevote.title_${type}`)}{' '}
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
            text: tt(`dialogs_transfer.delegatevote.button_${type}`),
            primary: true,
            disabled: !this.canSend(),
            onClick: this.onOkClick,
          },
        ]}
        onCloseClick={this.onCloseClick}
      >
        <Content>
          {hint ? <SubHeader>{hint}</SubHeader> : null}
          <Body>
            {type === 'recallvote' ? (
              <SectionSlider>
                <SliderWrapper>
                  <Slider
                    value={recallAmount}
                    min={1}
                    max={stakedBalance * 10000}
                    showCaptions
                    percentsInCaption
                    hideHandleValue
                    onChange={this.onSliderChange}
                  />
                </SliderWrapper>
                <RecallAmount>{recallAmount / 10000} CYBER</RecallAmount>
              </SectionSlider>
            ) : (
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
            )}
          </Body>
          <ErrorBlock>{error ? <ErrorLine>{error}</ErrorLine> : null}</ErrorBlock>
        </Content>
        {loader ? <SplashLoader /> : null}
      </DialogFrameStyled>
    );
  }
}
