import React, { Component } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import Slider from 'components/golos-ui/Slider';
import Icon from 'components/golos-ui/Icon';

import LoadingIndicator from 'components/elements/LoadingIndicator';

const FIRST_STRATEGY = 0;
const SECOND_STRATEGY = 1;

const Column = styled.div`
  flex-basis: 100px;
  flex-grow: 1;
  margin: 0 10px;
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

const Strategy = styled.li.attrs({ role: 'button' })`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 5px 0;
  cursor: pointer;
`;

const PayoutStrategies = styled.ul`
  display: flex;
  margin: 0;
  list-style: none;

  & ${Strategy}:first-child {
    padding-right: 5px;
  }

  & ${Strategy}:last-child {
    padding-left: 5px;
  }
`;

const StrategyText = styled.p`
  width: 100%;
  height: 100%;
  margin: 0 0 0 10px;
  text-transform: lowercase;
`;

const IconOn = styled(Icon).attrs({ name: 'checkbox-on' })`
  width: 18px;
  height: 18px;
  color: #2879ff;
  flex-shrink: 0;
`;

const IconOff = styled(Icon).attrs({ name: 'checkbox-off' })`
  width: 18px;
  height: 18px;
  color: #d7d7d7;
  flex-shrink: 0;
`;

export default class ReceiveRewards extends Component {
  renderRewardRateSlider() {
    const { chainProps, rewardRate, onRewardRateChange } = this.props;

    if (!chainProps) {
      return <LoadingIndicator type="circle" size={25} />;
    }

    const maxValue = 100; /*chainProps.max_delegated_vesting_interest_rate / 100*/
    return <Slider value={rewardRate} min={0} max={maxValue} onChange={onRewardRateChange} />;
  }

  render() {
    const { setStrategy, payoutStrategy } = this.props;

    return (
      <Column>
        <Section>
          <Label>{tt('dialogs_transfer.delegate_vesting.tabs.delegate.interest_rate')}</Label>
          {this.renderRewardRateSlider()}
        </Section>
        <PayoutStrategies>
          <Strategy onClick={setStrategy(FIRST_STRATEGY)}>
            {payoutStrategy === FIRST_STRATEGY ? <IconOn /> : <IconOff />}
            <StrategyText>{tt('dialogs_transfer.delegate_vesting.first_strategy')}</StrategyText>
          </Strategy>
          <Strategy onClick={setStrategy(SECOND_STRATEGY)}>
            {payoutStrategy === SECOND_STRATEGY ? <IconOn /> : <IconOff />}
            <StrategyText>{tt('dialogs_transfer.delegate_vesting.second_strategy')}</StrategyText>
          </Strategy>
        </PayoutStrategies>
      </Column>
    );
  }
}
