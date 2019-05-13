/*
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { Checkbox } from 'components/golos-ui/Form';

import { isBadActor } from 'utils/chainValidation';
import { parseAmount } from 'helpers/currency';
import { saveValue, getValue } from 'helpers/localStorageUtils';
import { processError } from 'helpers/dialogs';

import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';
import AccountNameInput from 'components/common/AccountNameInput';
import DialogTypeSelect from 'components/userProfile/common/DialogTypeSelect';

const CURRENCY_SAVE_KEY = 'transfer-dialog.default-currency';

const TYPES = {
  SAVE: 'SAVE',
  RECEIVE: 'RECEIVE',
};

const CURRENCIES = {
  GBG: 'GBG',
  GOLOS: 'GOLOS',
};

const DialogFrameStyled = styled(DialogFrame)`
  flex-basis: 348px;
`;

const Content = styled.div`
  padding: 10px 30px 14px;
`;

const SubHeader = styled.div`
  margin: 10px 0 20px;
  text-align: center;
  font-size: 14px;
  color: #959595;
`;

const Body = styled.div``;

const Section = styled.div`
  margin: 10px 0;

  ${is('flex')`
    display: flex;
  `};
`;

const Label = styled.div`
  margin-bottom: 9px;
  font-size: 14px;
`;

const ErrorBlock = styled.div`
  min-height: 25px;
`;

const ErrorLine = styled.div`
  color: #ff4641;
  animation: fade-in 0.15s;
`;

export default class SafeDialog extends PureComponent {
  state = {
    type: TYPES.SAVE,
    target: '',
    amount: '',
    currency: getValue(CURRENCY_SAVE_KEY, [CURRENCIES.GBG, CURRENCIES.GOLOS]) || CURRENCIES.GOLOS,
    amountInFocus: false,
    saveTo: false,
    loader: false,
    disabled: false,
  };

  confirmClose() {
    if (this.state.amount.trim() || (this.state.saveTo ? this.state.target.trim() : false)) {
      DialogManager.dangerConfirm(tt('dialogs_transfer.confirm_dialog_close')).then(y => {
        if (y) {
          this.props.onClose();
        }
      });

      return false;
    }
    return true;
  }

  onSaveTypeChange = checked => {
    this.setState({
      saveTo: checked,
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

  onCurrencyChange = currency => {
    this.setState({
      currency,
    });

    saveValue(CURRENCY_SAVE_KEY, currency);
  };

  onTargetChange = value => {
    this.setState({
      target: value,
    });
  };

  onCloseClick = () => {
    this.props.onClose();
  };

  onOkClick = () => {
    const { currentUsername } = this.props;
    const { target, amount, currency, type, saveTo, loader, disabled } = this.state;

    if (loader || disabled) {
      return;
    }

    this.setState({
      loader: true,
      disabled: true,
    });

    const operation = {
      from: currentUsername,
      to: saveTo ? target.trim() : currentUsername,
      amount: `${parseFloat(amount.replace(/\s+/, '')).toFixed(3)} ${currency}`,
      memo: '',
      request_id: Math.floor((Date.now() / 1000) % 4294967296),
    };

    const actionType = type === TYPES.SAVE ? 'transfer_to_savings' : 'transfer_from_savings';

    this.props.transfer(actionType, operation, err => {
      if (err) {
        this.setState({
          loader: false,
          disabled: false,
        });

        processError(err);
      } else {
        this.setState({
          loader: false,
        });

        this.props.showNotification(tt('dialogs_transfer.operation_success'));
        this.props.onClose();
      }
    });
  };

  onTypeClick = type => {
    this.setState({
      type,
      amount: '',
      saveTo: false,
    });
  };

  render() {
    const { target, amount, currency, loader, disabled, amountInFocus, type, saveTo } = this.state;

    const buttons = [
      {
        id: CURRENCIES.GBG,
        title: 'GBG',
      },
      {
        id: CURRENCIES.GOLOS,
        title: tt('token_names.LIQUID_TOKEN'),
      },
    ];

    let currencyKey = null;

    if (type === TYPES.SAVE) {
      if (currency === CURRENCIES.GOLOS) {
        currencyKey = 'balance';
      } else if (currency === CURRENCIES.GBG) {
        currencyKey = 'sbd_balance';
      }
    } else if (currency === CURRENCIES.GOLOS) {
      currencyKey = 'savings_balance';
    } else if (currency === CURRENCIES.GBG) {
      currencyKey = 'savings_sbd_balance';
    }

    const balance = 1.00070035; /!*parseFloat(myAccount.get(currencyKey))*!/

    let { value, error } = parseAmount(amount, balance, !amountInFocus);
    if (isBadActor(target)) {
      error = tt('chainvalidation_js.use_caution_sending_to_this_account');
    }
    const targetCheck = saveTo ? target && target.trim() : true;

    const allow = targetCheck && value > 0 && !error && !loader && !disabled;

    return (
      <DialogFrameStyled
        title={tt('dialogs_transfer.transfer_to_savings.title')}
        titleSize={20}
        icon="locked"
        buttons={[
          {
            text: tt('g.cancel'),
            onClick: this.onCloseClick,
          },
          {
            text: tt('dialogs_transfer.transfer_to_savings.transfer_button'),
            primary: true,
            disabled: !allow,
            onClick: this.onOkClick,
          },
        ]}
        onCloseClick={this.onCloseClick}
      >
        <DialogTypeSelect
          activeId={type}
          buttons={[
            {
              id: TYPES.SAVE,
              title: tt('dialogs_transfer.transfer_to_savings.transfer'),
            },
            {
              id: TYPES.RECEIVE,
              title: tt('dialogs_transfer.transfer_to_savings.withdraw'),
            },
          ]}
          onClick={this.onTypeClick}
        />
        <Content>
          <SubHeader>
            {type === TYPES.SAVE
              ? tt('dialogs_transfer.transfer_to_savings.tip_transfer')
              : tt('dialogs_transfer.transfer_to_savings.tip_withdraw')}
          </SubHeader>
          <Body>
            <Section>
              <Label>{tt('dialogs_transfer.amount')}</Label>
              <ComplexInput
                placeholder={tt('dialogs_transfer.amount_placeholder', {
                  amount: balance.toFixed(3),
                })}
                spellCheck="false"
                value={amount}
                activeId={currency}
                buttons={buttons}
                onChange={this.onAmountChange}
                onFocus={this.onAmountFocus}
                onBlur={this.onAmountBlur}
                onActiveChange={this.onCurrencyChange}
              />
            </Section>
            <Section flex>
              <Checkbox
                title={tt('dialogs_transfer.transfer_check')}
                inline
                value={saveTo}
                onChange={this.onSaveTypeChange}
              />
            </Section>
            {saveTo ? (
              <Section>
                <Label>{tt('dialogs_transfer.to')}</Label>
                <AccountNameInput
                  name="account"
                  block
                  autoFocus
                  placeholder={tt('dialogs_transfer.to_placeholder')}
                  value={target}
                  onChange={this.onTargetChange}
                />
              </Section>
            ) : null}
          </Body>
          <ErrorBlock>{error ? <ErrorLine>{error}</ErrorLine> : null}</ErrorBlock>
        </Content>
        {loader ? <SplashLoader /> : null}
      </DialogFrameStyled>
    );
  }
}
*/

// deleted in new BlockChain
