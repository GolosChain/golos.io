import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { CheckboxInput } from 'components/golos-ui/Form';
import Shrink from 'components/golos-ui/Shrink';
import { processError } from 'helpers/dialogs';

import { MIN_VOICE_POWER } from 'constants/config';
import { isBadActor } from 'utils/chainValidation';
import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';
import DialogTypeSelect from 'components/userProfile/common/DialogTypeSelect';
import { parseAmount2 } from 'helpers/currency';
import { vestsToGolos, golosToVests } from 'utils/StateFunctions';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import AccountNameInput from 'components/common/AccountNameInput';
import DelegationEdit from './DelegationEdit';
import DelegationsList from './DelegationsList';
import ReceiveRewards from './ReceiveRewards';

const TYPES = {
  DELEGATE: 'DELEGATE',
  CANCEL: 'CANCEL',
};

const DEFAULT_DELEGATED_VESTING_INTEREST_RATE = 25;
const MULTIPLIER = 1000;

const DialogFrameStyled = styled(DialogFrame)`
  flex-basis: 580px;

  @media (max-width: 550px) {
    flex-basis: 340px;
  }
`;

const Container = styled.div``;

const Content = styled.div`
  padding: 10px 30px 14px;
`;

const SubHeader = styled.div`
  padding: 30px;
  margin-bottom: 1px;
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

const Columns = styled.div`
  display: flex;
  margin: 0 -10px;

  @media (max-width: 550px) {
    display: block;
  }
`;

const Column = styled.div`
  flex-basis: 100px;
  flex-grow: 1;
  margin: 0 10px;
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

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

export default class DelegateDialog extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    currentUsername: PropTypes.string.isRequired,
    recipientName: PropTypes.string.isRequired,
    power: PropTypes.number.isRequired,
    vestingParams: PropTypes.shape({}).isRequired,
    delegateTokens: PropTypes.func.isRequired,
    stopDelegateTokens: PropTypes.func.isRequired,
    getVestingParams: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    let target = '';

    if (props.recipientName && props.recipientName !== props.currentUsername) {
      target = props.recipientName;
    }

    this.state = {
      type: TYPES.DELEGATE,
      target,
      amount: '',
      amountInFocus: false,
      loader: false,
      disabled: false,
      delegationError: null,
      delegationData: null,
      editAccountName: null,
      autoFocusValue: Boolean(target),
      isReceiveReward: false,
      rewardRate: DEFAULT_DELEGATED_VESTING_INTEREST_RATE,
      payoutStrategy: 0,
    };
  }

  componentDidMount() {
    const { getVestingParams } = this.props;

    // TODO
    // getVestingParams();

    this.loadDelegationsData();
  }

  setStrategy = strategy => () => {
    const { payoutStrategy } = this.state;
    if (payoutStrategy !== strategy) {
      this.setState({ payoutStrategy: strategy });
    }
  };

  onDelegationCancel = async (to, quantity) => {
    const { stopDelegateTokens } = this.props;
    if (await DialogManager.confirm()) {
      await stopDelegateTokens(to, quantity, 0);
    }
  };

  onDelegationEditSave = value => {
    const { editAccountName } = this.state;
    this.updateDelegation(editAccountName, value);
  };

  onDelegationEditCancel = () => {
    this.setState({
      editAccountName: null,
    });
  };

  onDelegationEdit = accountName => {
    this.setState({
      editAccountName: accountName,
    });
  };

  onTypeClick = type => {
    this.setState({
      type,
      amount: '',
    });
  };

  getHintText() {
    const { type } = this.state;

    switch (type) {
      case TYPES.DELEGATE:
        return [
          tt('dialogs_transfer.delegate_vesting.tabs.delegate.tip_1'),
          tt('dialogs_transfer.delegate_vesting.tabs.delegate.tip_2'),
        ];
      default:
        return [];
    }
  }

  onAmountChange = e => {
    this.setState({
      amount: e.target.value.replace(/,/g, '.').replace(/[^\d.]+/g, ''),
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

  isReceiveRewardChange = checked => {
    this.setState({
      isReceiveReward: checked,
    });
  };

  onRewardRateChange = value => {
    this.setState({
      rewardRate: value,
    });
  };

  onCloseClick = () => {
    const { onClose } = this.props;
    onClose();
  };

  onOkClick = async () => {
    const { userId, delegateTokens } = this.props;
    const {
      target,
      amount,
      loader,
      disabled,
      isReceiveReward,
      rewardRate,
      payoutStrategy,
    } = this.state;

    if (loader || disabled) {
      return;
    }

    this.setState({
      loader: true,
      disabled: true,
    });

    let percent;
    if (isReceiveReward) {
      percent = rewardRate;
    }

    try {
      await delegateTokens(target, amount, percent, payoutStrategy);

      this.setState({
        loader: false,
      });

      DialogManager.info(tt('dialogs_transfer.operation_success'));

      this.loadDelegationsData();
    } catch (err) {
      this.setState({
        loader: false,
        disabled: false,
      });

      processError(err);
    }
  };

  confirmClose() {
    const { onClose } = this.props;
    const { amount, target } = this.state;

    if (amount.trim() || target) {
      DialogManager.dangerConfirm(tt('dialogs_transfer.confirm_dialog_close')).then(y => {
        if (y) {
          onClose();
        }
      });

      return false;
    }
    return true;
  }

  async loadDelegationsData() {
    try {
      // TODO
      const result = [
        {
          id: 0,
          delegator: 'test1',
          delegatee: 'test2',
          vesting_shares: '90.000000 GOLOS',
        },
      ];

      this.setState({
        delegationError: null,
        delegationData: result,
      });
    } catch (err) {
      this.setState({
        delegationError: err,
        delegationData: null,
      });
    }
  }

  async updateDelegation(delegatee, value) {
    const { delegateTokens, stopDelegateTokens } = this.props;

    const delegationAction = value > 0 ? delegateTokens : stopDelegateTokens;

    this.setState({
      disabled: true,
      loader: true,
    });

    try {
      await delegationAction(delegatee, value);

      this.setState({
        disabled: false,
        loader: false,
        editAccountName: null,
      });

      this.loadDelegationsData();
    } catch (err) {
      this.setState({
        disabled: false,
        loader: false,
      });
      processError(err);
    }
  }

  renderDelegateBody({ availableBalanceString }) {
    const { vestingParams } = this.props;
    const {
      target,
      amount,
      autoFocusValue,
      isReceiveReward,
      rewardRate,
      payoutStrategy,
    } = this.state;

    const isReceiveRewardAvailable = vestingParams.maxInterest !== 0;

    return (
      <>
        <Columns>
          <Column>
            <Section>
              <Label>{tt('dialogs_transfer.to')}</Label>
              <AccountNameInput
                name="account"
                block
                placeholder={tt('dialogs_transfer.delegate_vesting.tabs.delegated.to_placeholder')}
                autoFocus={!autoFocusValue}
                value={target}
                onChange={this.onTargetChange}
              />
            </Section>
          </Column>
          <Column>
            <Section>
              <Label>{tt('dialogs_transfer.delegate_vesting.tabs.delegated.amount_label')}</Label>
              <ComplexInput
                placeholder={tt('dialogs_transfer.amount_placeholder', {
                  amount: availableBalanceString,
                })}
                spellCheck="false"
                value={amount}
                activeId="power"
                buttons={[{ id: 'power', title: tt('token_names.VESTING_TOKEN3') }]}
                autoFocus={autoFocusValue}
                onChange={this.onAmountChange}
                onFocus={this.onAmountFocus}
                onBlur={this.onAmountBlur}
              />
            </Section>
          </Column>
        </Columns>
        <Columns>
          {isReceiveRewardAvailable && (
            <Column>
              <Section>
                <CheckboxInput
                  value={isReceiveReward}
                  title={tt('dialogs_transfer.delegate_vesting.tabs.delegate.receive_rewards')}
                  onChange={this.isReceiveRewardChange}
                />
              </Section>
            </Column>
          )}
        </Columns>
        <Columns>
          {isReceiveReward && (
            <ReceiveRewards
              rewardRate={rewardRate}
              payoutStrategy={payoutStrategy}
              onRewardRateChange={this.onRewardRateChange}
              setStrategy={this.setStrategy}
            />
          )}
        </Columns>
      </>
    );
  }

  renderCancelBody({ availableBalance }) {
    const { currentUsername } = this.props;
    const { delegationError, delegationData, editAccountName } = this.state;

    if (delegationError) {
      return String(delegationError);
    }

    if (!delegationData) {
      return (
        <LoaderWrapper>
          <LoadingIndicator type="circle" size={60} />
        </LoaderWrapper>
      );
    }

    let delegation = null;
    let vestingShares = null;

    if (editAccountName) {
      const data = delegationData.find(d => d.delegatee === editAccountName);

      if (data) {
        delegation = data;
        vestingShares = Math.round(parseFloat(data.vesting_shares) * 1000);
      }
    }

    return (
      <>
        <DelegationsList
          myAccountName={currentUsername}
          data={delegationData}
          onEditClick={this.onDelegationEdit}
          onCancelClick={this.onDelegationCancel}
        />
        {delegation ? (
          <DelegationEdit
            value={vestingShares}
            max={availableBalance + vestingShares}
            onSave={this.onDelegationEditSave}
            onCancel={this.onDelegationEditCancel}
          />
        ) : null}
      </>
    );
  }

  render() {
    const { power, vestingParams } = this.props;
    const { target, amount, loader, disabled, amountInFocus, type } = this.state;

    const availableBalance = Math.max(
      0,
      Math.round((parseFloat(power) - MIN_VOICE_POWER) * MULTIPLIER)
    );
    const availableBalanceString = (availableBalance / MULTIPLIER).toFixed(3);

    const { value, error } = parseAmount2(amount, availableBalance, !amountInFocus, MULTIPLIER);

    let errorMsg = error;

    const minDelegationAmount = vestingParams.minAmount / 1000000;

    if (value < minDelegationAmount * MULTIPLIER) {
      errorMsg = tt('dialogs_transfer.delegate_vesting.min_amount', {
        amount: minDelegationAmount,
      });
    }

    if (isBadActor(target)) {
      errorMsg = tt('chainvalidation_js.use_caution_sending_to_this_account');
    }

    const allow = target && value > 0 && !errorMsg && !loader && !disabled;

    const hint = null;

    const params = {
      availableBalance: power,
      availableBalanceString,
    };

    let buttons;

    if (type === TYPES.DELEGATE) {
      buttons = [
        {
          text: tt('g.cancel'),
          onClick: this.onCloseClick,
        },
        {
          text: tt('dialogs_transfer.delegate_vesting.delegate_button'),
          primary: true,
          disabled: !allow,
          onClick: this.onOkClick,
        },
      ];
    } else {
      buttons = [
        {
          text: tt('g.close'),
          onClick: this.onCloseClick,
        },
      ];
    }

    return (
      <DialogFrameStyled
        title={tt('dialogs_transfer.delegate_vesting.title')}
        titleSize={20}
        icon="voice"
        buttons={buttons}
        onCloseClick={this.onCloseClick}
      >
        <Container>
          <DialogTypeSelect
            activeId={type}
            buttons={[
              {
                id: TYPES.DELEGATE,
                title: tt('dialogs_transfer.delegate_vesting.tabs.delegate.title'),
              },
              {
                id: TYPES.CANCEL,
                title: tt('dialogs_transfer.delegate_vesting.tabs.delegated.title'),
              },
            ]}
            onClick={this.onTypeClick}
          />
          {type === TYPES.DELEGATE ? (
            <>
              <SubHeader>
                {this.getHintText().map(line => (
                  <SubHeaderLine key={line}>{line}</SubHeaderLine>
                ))}
              </SubHeader>
              <Content>
                <Body style={{ height: 'auto' }}>{this.renderDelegateBody(params)}</Body>
                <Footer>
                  {errorMsg && <ErrorLine>{errorMsg}</ErrorLine>}
                  {hint && <HintLine>{hint}</HintLine>}
                </Footer>
              </Content>
            </>
          ) : (
            <Content>{this.renderCancelBody(params)}</Content>
          )}
        </Container>
        {loader ? <SplashLoader /> : null}
      </DialogFrameStyled>
    );
  }
}
