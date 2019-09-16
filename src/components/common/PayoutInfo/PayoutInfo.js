import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import HintIcon from 'components/elements/common/HintIcon/HintIcon';

const Root = styled.div`
  border-radius: 8px;
  color: #393636;
  background: #fff;
`;

const Part = styled.div`
  padding: 12px 24px;
  border-bottom: 1px solid #e1e1e1;

  &:first-child {
    padding-top: 12px;
  }

  &:last-child {
    padding-bottom: 12px;
    border: none;
  }
`;

const Title = styled.div`
  margin: 10px 0;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
`;

const Payout = styled.div`
  margin-bottom: 4px;
  text-align: center;
  font-size: 18px;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  height: 38px;
`;

const Label = styled.div`
  flex-grow: 1;
  margin-right: 38px;
  line-height: 1.2em;
  color: #959595;
`;

const Money = styled.span`
  white-space: nowrap;
  font-weight: bold;
  margin-right: 24px;
`;

export default class PayoutInfo extends PureComponent {
  renderOverallValue() {
    const { totalPayout } = this.props;

    return (
      <>
        <Money>{totalPayout} GOLOS</Money>
      </>
    );
  }

  render() {
    const { done, author, curator, benefactor, unclaimed } = this.props;

    return (
      <Root>
        <Part>
          <Title>{done ? tt('payout_info.payout') : tt('payout_info.potential_payout')}</Title>
          <Payout>{this.renderOverallValue()}</Payout>
        </Part>
        <Part>
          {author ? (
            <Line>
              <Label>{tt('payout_info.author')}</Label>
              <Money>
                {author.value} {author.sym}
              </Money>
              <HintIcon hint={tt('payout_info.author_hint')} />
            </Line>
          ) : null}
          {curator ? (
            <Line>
              <Label>{tt('payout_info.curator')}</Label>
              <Money>
                {curator.value} {curator.sym}
              </Money>
              <HintIcon hint={tt('payout_info.curator_hint')} />
            </Line>
          ) : null}
          {benefactor ? (
            <Line>
              <Label>{tt('payout_info.beneficiary')}</Label>
              <Money>
                {benefactor.value} {benefactor.sym}
              </Money>
              <HintIcon hint={tt('payout_info.beneficiary_hint')} />
            </Line>
          ) : null}
        </Part>
        {unclaimed ? (
          <Part>
            <Line>
              <Label>{tt('payout_info.unclaimed')}</Label>
              <Money>
                {unclaimed.value} {unclaimed.sym}
              </Money>
              <HintIcon hint={tt('payout_info.unclaimed_hint')} />
            </Line>
          </Part>
        ) : null}
      </Root>
    );
  }
}
