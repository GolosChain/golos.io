import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';
import Icon from 'components/golos-ui/Icon';

import { APP_DOMAIN, DONATION_FOR } from 'constants/config';
import { isBadActor } from 'utils/chainValidation';
import { parseAmount } from 'helpers/currency';
import { processError } from 'helpers/dialogs';

import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';
import AccountNameInput from 'components/common/AccountNameInput';

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

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  width: 288px;
  padding: 0 10px;

  @media (max-width: 640px) {
    width: unset;
  }
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

const NoteIcon = styled(Icon)`
  margin: -10px 6px -10px 0;
  color: #e1e1e1;
`;

const Note = styled.textarea`
  display: block;
  width: 100%;
  height: 120px;
  padding: 7px 11px;
  border: 1px solid #e1e1e1;
  outline: none;
  border-radius: 6px;
  resize: none;
  font-size: 14px;
  box-shadow: none !important;

  @media (max-width: 640px) {
    height: 60px;
  }
`;

const ErrorBlock = styled.div`
  min-height: 25px;
`;

const ErrorLine = styled.div`
  color: #ff4641;
  animation: fade-in 0.15s;
`;

export default class TransferDialog extends PureComponent {
  static propTypes = {
    currentUsername: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['donate', 'query', 'transfer']),
    recipientName: PropTypes.string.isRequired,
    amount: PropTypes.number,
    token: PropTypes.string,
    memo: PropTypes.string,

    // redux
    balance: PropTypes.number.isRequired,
    cyberBalance: PropTypes.number.isRequired,

    close: PropTypes.func.isRequired,
    transferToken: PropTypes.func.isRequired,
  };

  static defaultProps = {
    type: 'transfer',
    amount: 0,
    token: CURRENCIES.GOLOS.id,
    memo: '',
  };

  constructor(props) {
    super(props);

    let target = '';

    if (props.recipientName && props.recipientName !== props.currentUsername) {
      target = props.recipientName;
    }

    let amount = '';
    if (props.type === 'query' && props.amount) {
      // eslint-disable-next-line prefer-destructuring
      amount = props.amount;
    }

    let currency = CURRENCIES.GOLOS.id;
    if (props.type === 'query' && props.token) {
      currency = CURRENCIES[props.token].id;
    }

    let note = '';
    if (props.type === 'query' && props.memo) {
      note = props.memo;
    }

    if (props.type === 'donate' && props.memo) {
      // eslint-disable-next-line no-multi-assign
      this.initialNote = note = tt('dialogs_transfer.post_donation', {
        url: `https://${APP_DOMAIN}${props.memo}`,
      });
    }

    this.state = {
      target,
      initialTarget: Boolean(target),
      amount,
      currency,
      note,
      amountInFocus: false,
      loader: false,
      disabled: false,
    };
  }

  onNoteChange = e => {
    this.setState({
      note: e.target.value,
    });
  };

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

  onTargetChange = value => {
    this.setState({
      target: value,
    });
  };

  onCurrencyChange = currency => {
    this.setState({
      currency,
    });
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  onOkClick = async () => {
    const { type, memo, transferToken, close } = this.props;
    const { target, amount, currency, note, loader, disabled } = this.state;

    if (loader || disabled) {
      return;
    }

    if (note) {
      if (/\b5[\w\d]{50}\b/.test(note) || /\b[PK5][\w\d]{51}\b/.test(note)) {
        DialogManager.alert(tt('g.note_contains_keys_error'));
        return;
      }
    }

    let memoStr = note;

    if (type === 'donate' && memo) {
      if (note === this.initialNote) {
        memoStr = `${DONATION_FOR} ${memo}`;
      }
    }

    const tokensAmount = parseFloat(amount.replace(/\s+/, '')).toFixed(CURRENCIES[currency].decs);

    this.setState({
      loader: true,
    });

    try {
      await transferToken(target, tokensAmount, currency, memoStr);
      this.unblockDialog();
      close();
    } catch (err) {
      this.unblockDialog();
      processError(err);
    }
  };

  confirmClose() {
    const { close } = this.props;
    const { target, note, amount } = this.state;

    if (target || note.trim() || amount.trim()) {
      DialogManager.dangerConfirm(tt('dialogs_transfer.confirm_dialog_close')).then(y => {
        if (y) {
          close();
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
    const { type, recipientName, balance, cyberBalance } = this.props;
    const {
      target,
      initialTarget,
      amount,
      currency,
      note,
      loader,
      disabled,
      amountInFocus,
    } = this.state;

    const buttons = [
      {
        id: CURRENCIES.GOLOS.id,
        title: tt('token_names.LIQUID_TOKEN'),
      },
      {
        id: CURRENCIES.CYBER.id,
        title: 'CYBER',
      },
    ];

    let availableBalance;
    if (currency === CURRENCIES.GOLOS.id) {
      availableBalance = balance;
    } else if (currency === CURRENCIES.CYBER.id) {
      availableBalance = cyberBalance;
    }

    let { value, error } = parseAmount(amount, {
      balance: availableBalance,
      isFinal: !amountInFocus,
      decs: CURRENCIES[currency].decs,
    });

    if (isBadActor(target)) {
      error = tt('chainvalidation_js.use_caution_sending_to_this_account');
    }

    const allow = target && value > 0 && !error && !loader && !disabled;

    const lockTarget = type === 'donate' && recipientName;
    const focusTarget = !lockTarget && !initialTarget;

    return (
      <DialogFrameStyled
        title={tt('dialogs_transfer.transfer.title')}
        titleSize={20}
        icon="coins"
        buttons={[
          {
            text: tt('g.cancel'),
            onClick: this.onCloseClick,
          },
          {
            text: tt('dialogs_transfer.transfer.transfer_button'),
            primary: true,
            disabled: !allow,
            onClick: this.onOkClick,
          },
        ]}
        onCloseClick={this.onCloseClick}
      >
        <Content>
          <SubHeader>{tt('dialogs_transfer.transfer.tip')}</SubHeader>
          <Body>
            <Column>
              <Section>
                <Label>{tt('dialogs_transfer.to')}</Label>
                <AccountNameInput
                  block
                  name="account"
                  autoFocus={focusTarget}
                  disabled={lockTarget}
                  placeholder={tt('dialogs_transfer.to_placeholder')}
                  value={target}
                  onChange={this.onTargetChange}
                />
              </Section>
              <Section>
                <Label>{tt('dialogs_transfer.amount')}</Label>
                <ComplexInput
                  placeholder={tt('dialogs_transfer.amount_placeholder', {
                    amount: availableBalance.toFixed(CURRENCIES[currency].decs),
                  })}
                  spellCheck="false"
                  value={amount}
                  autoFocus={!focusTarget}
                  activeId={currency}
                  buttons={buttons}
                  onChange={this.onAmountChange}
                  onFocus={this.onAmountFocus}
                  onBlur={this.onAmountBlur}
                  onActiveChange={this.onCurrencyChange}
                />
              </Section>
            </Column>
            <Column>
              <Section>
                <Label>
                  <NoteIcon name="note" /> {tt('dialogs_transfer.transfer.memo')}
                </Label>
                <Note
                  placeholder={tt('dialogs_transfer.transfer.memo_placeholder')}
                  value={note}
                  onChange={this.onNoteChange}
                />
              </Section>
            </Column>
          </Body>
          <ErrorBlock>{error ? <ErrorLine>{error}</ErrorLine> : null}</ErrorBlock>
        </Content>
        {loader ? <SplashLoader /> : null}
      </DialogFrameStyled>
    );
  }
}
