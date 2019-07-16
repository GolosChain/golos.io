import React from 'react';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import tt from 'counterpart';
import is from 'styled-is';

import { breakWordStyles } from 'helpers/styles';
import Icon from 'components/golos-ui/Icon/Icon';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import TextCut from 'components/common/TextCut';

const Root = styled.div`
  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0 20px;
`;

const LineIcon = styled(Icon)`
  flex-shrink: 0;
  width: 24px;
  height: 80px;
  color: ${props => props.color || '#b7b7ba'};
`;

const Who = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 10px;
  padding: 0 16px;
  height: 80px;
  overflow: hidden;
`;

const WhoTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: #959595;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Value = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
  width: auto;
  height: 80px;
  justify-content: center;
`;

const Amount = styled.div`
  margin-top: 2px;
  line-height: 24px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.color || '#b7b7ba'};
  white-space: nowrap;
  overflow: hidden;

  @media (min-width: 890px) and (max-width: 1023px), (max-width: 639px) {
    font-size: 18px;
  }
`;

const Currency = styled.div`
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
`;

const CURRENCY_COLOR = {
  GOLOS: '#2879ff',
};

function VestingLine({
  router: {
    query: { userId },
  },
  vesting,
}) {
  const { id, who, diff, block, trxId, timestamp } = vesting;
  //
  // const samePerson = receiver.userId === sender.userId;
  // const isSent = sender.userId === userId;
  // const isReceive = receiver.userId === userId && !samePerson;
  //
  // const icon = sym === CURRENCY.GOLOS ? 'logo' : 'brilliant';
  // const color = CURRENCY_COLOR[sym] : null;
  //
  // const memoIconText = null; // TODO

  const isPowerUp = !diff.GESTS.startsWith('-');

  const color = isPowerUp ? '#f57c02' : null;
  const title = isPowerUp
    ? tt('user_wallet.content.power_up')
    : tt('user_wallet.content.power_down');

  return (
    <Root>
      <Line>
        <LineIcon name="logo" color={color} />
        <Who>
          <WhoTitle>{title} </WhoTitle>
          <TimeStamp>
            <TimeAgoWrapper date={timestamp} />
          </TimeStamp>
        </Who>
        <Value>
          <Amount color={color}>{diff.GESTS}</Amount>
          <Currency>{tt('token_names.VESTING_TOKEN')}</Currency>
        </Value>
      </Line>
      {/*{this.renderEditDelegation()}*/}
      {/*{loader ? <SplashLoader light /> : null}*/}
    </Root>
  );
}

export default withRouter(VestingLine);
