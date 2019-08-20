import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import ToastsManager from 'toasts-manager';

import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { processError } from 'helpers/dialogs';
import { displayError } from 'utils/toastMessages';

import { isBadActor } from 'utils/chainValidation';
import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';
import { parseAmount } from 'helpers/currency';
import { boldify } from 'helpers/text';
import DialogTypeSelect from 'components/userProfile/common/DialogTypeSelect';

import { CURRENCIES } from 'shared/constants';
import AdditionalSection from './AdditionalSection';

const POWER_TO_GOLOS_INTERVAL = 13; // weeks

const CONVERT_TYPE = {
  GOLOS: 'GOLOS',
  CYBER: 'CYBER',
};

const TYPES = {
  GOLOS: 'GOLOS',
  POWER: 'POWER',
  CYBER: 'CYBER',
  STAKE: 'STAKE',
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
    toWithdraw: PropTypes.string,
    withdrawn: PropTypes.string,
    balance: PropTypes.number,
    powerBalance: PropTypes.number,
    currentUserId: PropTypes.string,
    cyberBalance: PropTypes.number,
    stakedBalance: PropTypes.number,

    onClose: PropTypes.func.isRequired,
    withdrawTokens: PropTypes.func.isRequired,
    withdrawStake: PropTypes.func.isRequired,
    transferToken: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    convertTokensToVesting: PropTypes.func.isRequired,
  };

  static defaultProps = {
    balance: 0,
    powerBalance: 0,
    cyberBalance: 0,
    stakedBalance: 0,
    currentUserId: '',
    toWithdraw: '',
    withdrawn: '',
  };

  state = {
    convertType: CONVERT_TYPE.GOLOS,
    type: TYPES.GOLOS,
    recipient: '',
    amount: '',
    amountInFocus: false,
    saveTo: false,
    loader: false,
    disabled: false,
  };

  async componentDidMount() {
    const { getBalance, currentUserId } = this.props;

    try {
      await getBalance(currentUserId);
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
    const {
      currentUserId,
      withdrawTokens,
      withdrawStake,
      transferToken,
      convertTokensToVesting,
      onClose,
    } = this.props;
    const { amount, type, loader, disabled, saveTo, recipient } = this.state;

    if (loader || disabled) {
      return;
    }

    this.setState({
      loader: true,
      disabled: true,
    });

    const tokensQuantity = parseFloat(amount.replace(/\s+/, ''));

    try {
      if (type === TYPES.GOLOS) {
        await transferToken(
          'gls.vesting',
          tokensQuantity.toFixed(CURRENCIES.GOLOS.decs),
          'GOLOS',
          `send to: ${saveTo ? recipient : currentUserId}`
        );
      } else if (type === TYPES.POWER) {
        const convertedAmount = await convertTokensToVesting(tokensQuantity);
        await withdrawTokens(convertedAmount.split(' ')[0]);

        ToastsManager.info(tt('dialogs_transfer.operation_started'));
      } else if (type === TYPES.CYBER) {
        await transferToken(
          'cyber.stake',
          tokensQuantity.toFixed(CURRENCIES.CYBER.decs),
          'CYBER',
          `${currentUserId}`
        );
      } else if (type === TYPES.STAKE) {
        await withdrawStake(tokensQuantity.toFixed(CURRENCIES.CYBER.decs));
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

  onConvertTypeClick = type => {
    this.setState({
      convertType: type,
      type: TYPES[type],
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
      balance,
      powerBalance,
      toWithdraw,
      withdrawn,
      cyberBalance,
      stakedBalance,
    } = this.props;
    const {
      recipient,
      amount,
      loader,
      disabled,
      amountInFocus,
      type,
      saveTo,
      convertType,
    } = this.state;

    const TYPES_TRANSLATE = {
      GOLOS: tt('token_names.LIQUID_TOKEN'),
      POWER: tt('token_names.VESTING_TOKEN'),
      CYBER: 'CYBER',
      STAKE: 'CYBER STAKE',
    };

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

    let balanceByType;
    if (convertType === CONVERT_TYPE.GOLOS) {
      balanceByType = type === TYPES.POWER ? powerBalance : balance;
    } else if (convertType === CONVERT_TYPE.CYBER) {
      balanceByType = type === TYPES.STAKE ? stakedBalance : cyberBalance;
    }

    balanceByType = balanceByType.toFixed(
      convertType === CONVERT_TYPE.CYBER ? CURRENCIES.CYBER.decs : CURRENCIES.GOLOS.decs
    );

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
            activeId={convertType}
            buttons={[
              {
                id: CONVERT_TYPE.GOLOS,
                title: 'GOLOS',
              },
              {
                id: CONVERT_TYPE.CYBER,
                title: 'CYBER',
              },
            ]}
            onClick={this.onConvertTypeClick}
          />
          <DialogTypeSelect
            mobileColumn
            activeId={type}
            buttons={
              convertType === CONVERT_TYPE.GOLOS
                ? [
                    {
                      id: TYPES.GOLOS,
                      title: tt('dialogs_transfer.convert.tabs.golos_gp.title'),
                    },
                    {
                      id: TYPES.POWER,
                      title: tt('dialogs_transfer.convert.tabs.gp_golos.title'),
                    },
                  ]
                : [
                    {
                      id: TYPES.CYBER,
                      title: 'CYBER → STAKED',
                    },
                    {
                      id: TYPES.STAKE,
                      title: 'STAKED → CYBER',
                    },
                  ]
            }
            onClick={this.onClickType}
          />
          {convertType === CONVERT_TYPE.GOLOS && <SubHeader>{this.renderSubHeader()}</SubHeader>}
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
                    amount: balanceByType,
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
                balance={balanceByType}
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
