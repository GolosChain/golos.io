/* eslint-disable prefer-const */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import ToastsManager from 'toasts-manager';

import Shrink from 'components/golos-ui/Shrink';
import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { processError } from 'helpers/dialogs';
import { displayError } from 'utils/toastMessages';

// import { MIN_VOICE_POWER } from 'constants/config';
import { isBadActor } from 'utils/chainValidation';
import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';
import { parseAmount } from 'helpers/currency';
import { boldify } from 'helpers/text';
// import { vestsToGolos, golosToVests } from 'utils/StateFunctions';
import DialogTypeSelect from 'components/userProfile/common/DialogTypeSelect';

import AdditionalSection from './AdditionalSection';

const POWER_TO_GOLOS_INTERVAL = 13; // weeks

const TYPES = {
  GOLOS: 'GOLOS',
  POWER: 'POWER',
};

const DialogFrameStyled = styled(DialogFrame)`
  flex-basis: 580px;
`;

const Container = styled.div``;

const Content = styled.div`
  padding: 10px 30px 14px;
`;

const SubHeader = styled.div`
  padding: 30px 30px 15px;
  border-bottom: 1px solid #e1e1e1;
  text-align: center;
  font-size: 14px;
  color: #959595;
`;

const SubHeaderLine = styled.div`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Body = styled.div`
  height: auto;
  transition: height 0.15s;
  overflow: hidden;
`;

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

const Footer = styled.div`
  min-height: 25px;
`;

const FooterLine = styled.div`
  animation: fade-in 0.15s;
`;

const ErrorLine = styled(FooterLine)`
  color: #ff4641;
`;

const HintLine = styled(FooterLine)`
  font-size: 14px;
  color: #666;
`;

const Hint = styled.span`
  color: #3684ff;
  cursor: help;
`;

const PowerDownText = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: #393636;
`;

export default class ConvertDialog extends PureComponent {
  static propTypes = {
    myAccount: PropTypes.shape({}),
    globalProps: PropTypes.shape({}),
    toWithdraw: PropTypes.string,
    withdrawn: PropTypes.string,
    balance: PropTypes.number,
    powerBalance: PropTypes.number,
    currentUserId: PropTypes.string,

    onClose: PropTypes.func.isRequired,
    withdrawTokens: PropTypes.func.isRequired,
    transferToken: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getVestingBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    balance: 0,
    powerBalance: 0,
    currentUserId: '',
    myAccount: {},
    globalProps: {},
    toWithdraw: '',
    withdrawn: '',
  };

  state = {
    type: TYPES.GOLOS,
    recipient: '',
    amount: '',
    amountInFocus: false,
    saveTo: false,
    loader: false,
    disabled: false,
  };

  async componentDidMount() {
    const { getBalance, getVestingBalance, currentUserId } = this.props;

    try {
      await Promise.all([getBalance(currentUserId), getVestingBalance(currentUserId)]);
    } catch (err) {
      displayError('Cannot load user balance', err);
    }
  }

  onSaveTypeChange = checked => {
    this.setState({
      saveTo: checked,
    });
  };

  getBodyHeight() {
    const { type, saveTo } = this.state;

    // This height constants taken by experimental way from actual height in browser
    // Heights needs from smooth height animation
    switch (type) {
      case TYPES.GOLOS:
        return saveTo ? 192 : 117;
      case TYPES.POWER:
        return 138;
      default:
        return null;
    }
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

  onTargetChange = value => {
    this.setState({
      recipient: value,
    });
  };

  onCloseClick = () => {
    const { onClose } = this.props;
    onClose();
  };

  onOkClick = async () => {
    const { currentUserId, /* globalProps, */ withdrawTokens, transferToken, onClose } = this.props;
    const { amount, type, loader, disabled, saveTo, recipient } = this.state;

    if (loader || disabled) {
      return;
    }

    this.setState({
      loader: true,
      disabled: true,
    });

    const tokensQuantity = parseFloat(amount.replace(/\s+/, '')).toFixed(
      type === TYPES.POWER ? 6 : 3
    );
    console.log(tokensQuantity);
    try {
      if (type === TYPES.GOLOS) {
        await transferToken(
          'gls.vesting',
          tokensQuantity,
          `send to: ${saveTo ? recipient : currentUserId}`
        );
      } else if (type === TYPES.POWER) {
        // const vesting = golosToVests(parseFloat(amount.replace(/\s+/, '')), globalProps);
        await withdrawTokens(tokensQuantity);
        ToastsManager.info(tt('dialogs_transfer.operation_started'));
      }
      this.setState({
        loader: false,
      });
      onClose();
    } catch (err) {
      this.setState({
        loader: false,
        disabled: false,
      });

      processError(err);
    }
  };

  onClickType = type => {
    this.setState({
      type,
      amount: '',
      saveTo: false,
    });
  };

  onSliderChange = value => {
    let amount = '';

    if (value > 0) {
      amount = (value / 1000).toFixed(3);
    }

    this.setState({
      amount,
    });
  };

  confirmClose() {
    const { amount, saveTo, recipient } = this.state;
    const { onClose } = this.props;

    if (amount.trim() || (saveTo ? recipient.trim() : false)) {
      DialogManager.dangerConfirm(tt('dialogs_transfer.confirm_dialog_close')).then(y => {
        if (y) {
          onClose();
        }
      });

      return false;
    }
    return true;
  }

  renderSubHeader() {
    const { type } = this.state;

    switch (type) {
      case TYPES.GOLOS:
        return (
          <>
            <SubHeaderLine>{tt('dialogs_transfer.convert.tabs.golos_gp.tip_1')}</SubHeaderLine>
            <SubHeaderLine>
              {tt('dialogs_transfer.convert.tabs.golos_gp.tip_2')}{' '}
              <Hint data-hint={tt('dialogs_transfer.convert.tabs.golos_gp.hint')}>(?)</Hint>
              {'. '}
              {tt('dialogs_transfer.convert.tabs.golos_gp.tip_3')}
            </SubHeaderLine>
          </>
        );
      case TYPES.POWER:
        return <SubHeaderLine>{tt('dialogs_transfer.convert.tabs.gp_golos.tip_1')}</SubHeaderLine>;
      default:
        return null;
    }
  }

  render() {
    const {
      /* myAccount, globalProps, */ balance,
      powerBalance,
      toWithdraw,
      withdrawn,
    } = this.props;
    const { recipient, amount, loader, disabled, amountInFocus, type, saveTo } = this.state;

    const TYPES_TRANSLATE = {
      GOLOS: tt('token_names.LIQUID_TOKEN'),
      POWER: tt('token_names.VESTING_TOKEN'),
    };

    // let balanceString = null;

    /* if (type === TYPES.GOLOS) {
      balanceString = myAccount.balance;
      balance = parseFloat(balanceString);
    } else if (type === TYPES.POWER) {
      const { golos } = getVesting(myAccount, globalProps);

      balance = Math.max(0, parseFloat(golos) - MIN_VOICE_POWER);
      balanceString = balance.toFixed(3);
    } */

    /* balanceString.match(/^[^\s]*!/)[0] */

    let { value, error } = parseAmount(
      amount,
      type === TYPES.POWER ? powerBalance : balance,
      !amountInFocus
    );
    if (isBadActor(recipient)) {
      error = tt('chainvalidation_js.use_caution_sending_to_this_account');
    }

    const recipientCheck = saveTo ? recipient && recipient.trim() : true;

    const allow = recipientCheck && value > 0 && !error && !loader && !disabled;

    let hint = null;

    if (type === TYPES.POWER && value > 0) {
      const perWeek = value / POWER_TO_GOLOS_INTERVAL;
      const perWeekStr = perWeek.toFixed(3);

      hint = tt('dialogs_transfer.convert.tabs.gp_golos.per_week', {
        amount: perWeekStr,
      });
    }
    let footer;

    if (error) {
      footer = <ErrorLine>{error}</ErrorLine>;
    } else if (hint) {
      footer = <HintLine>{hint}</HintLine>;
    }

    return (
      <DialogFrameStyled
        title={tt('dialogs_transfer.convert.title')}
        titleSize={20}
        icon="refresh"
        buttons={[
          {
            text: tt('g.cancel'),
            onClick: this.onCloseClick,
          },
          {
            text: tt('dialogs_transfer.convert.convert_button'),
            primary: true,
            disabled: !allow,
            onClick: this.onOkClick,
          },
        ]}
        onCloseClick={this.onCloseClick}
      >
        <Container>
          <DialogTypeSelect
            mobileColumn
            activeId={type}
            buttons={[
              {
                id: TYPES.GOLOS,
                title: tt('dialogs_transfer.convert.tabs.golos_gp.title'),
              },
              {
                id: TYPES.POWER,
                title: tt('dialogs_transfer.convert.tabs.gp_golos.title'),
              },
            ]}
            onClick={this.onClickType}
          />
          <SubHeader>
            <Shrink height={72}>{this.renderSubHeader()}</Shrink>
          </SubHeader>
          <Content>
            {toWithdraw && type === TYPES.POWER ? (
              <PowerDownText>
                {boldify(
                  tt('dialogs_convert.power_down_line', {
                    all: toWithdraw,
                    done: withdrawn,
                  })
                )}
              </PowerDownText>
            ) : null}
            <Body style={{ height: this.getBodyHeight() }}>
              <Section>
                <Label>{tt('dialogs_transfer.amount')}</Label>
                <ComplexInput
                  placeholder={tt('dialogs_transfer.amount_placeholder', {
                    amount: type === TYPES.POWER ? powerBalance : balance,
                  })}
                  spellCheck="false"
                  value={amount}
                  onChange={this.onAmountChange}
                  onFocus={this.onAmountFocus}
                  onBlur={this.onAmountBlur}
                  activeId={type}
                  buttons={[{ id: type, title: TYPES_TRANSLATE[type] }]}
                />
              </Section>
              <AdditionalSection
                balance={type === TYPES.POWER ? powerBalance : balance}
                type={type}
                types={TYPES}
                recipient={recipient}
                saveTo={saveTo}
                amount={amount}
                onSaveTypeChange={this.onSaveTypeChange}
                onTargetChange={this.onTargetChange}
                onSliderChange={this.onSliderChange}
              />
            </Body>
            <Footer>{footer}</Footer>
          </Content>
        </Container>
        {loader ? <SplashLoader /> : null}
      </DialogFrameStyled>
    );
  }
}

/* function getVesting(account, props) {
  const vesting = parseFloat(account.vesting_shares);
  const delegated = parseFloat(account.delegated_vesting_shares);

  const availableVesting = vesting - delegated;

  return {
    golos: vestsToGolos(`${availableVesting.toFixed(6)} GESTS`, props),
  };
} */
