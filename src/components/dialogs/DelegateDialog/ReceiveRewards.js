import React, { Component } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import Slider from 'components/golos-ui/Slider';

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

export default class ReceiveRewards extends Component {
  renderRewardRateSlider() {
    const { rewardRate, onRewardRateChange } = this.props;

    // TODO
    const maxValue = 100;
    return <Slider value={rewardRate} min={0} max={maxValue} onChange={onRewardRateChange} />;
  }

  render() {
    return (
      <Column>
        <Section>
          <Label>{tt('dialogs_transfer.delegate_vesting.tabs.delegate.interest_rate')}</Label>
          {this.renderRewardRateSlider()}
        </Section>
      </Column>
    );
  }
}
