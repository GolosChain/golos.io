import React from 'react';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon/Icon';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import RewardContentLink from '../RewardContentLink';

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

function RewardLine({
  router: {
    query: { userId },
  },
  reward,
}) {
  const { timestamp, tokenType, type, contentId, quantity } = reward;
  const color = '#f57c02';

  let icon = 'logo';
  switch (type) {
    case 'curators':
      icon = 'k';
      break;
    case 'author':
      icon = 'a';
      break;
  }

  const CURRENCY_TRANSLATE = {
    liquid: tt('token_names.LIQUID_TOKEN'),
    vesting: tt('token_names.VESTING_TOKEN'),
  };

  return (
    <Root>
      <Line>
        <LineIcon name={icon} color={color} />
        <Who>
          <RewardContentLink contentId={contentId} />
          <TimeStamp>
            <TimeAgoWrapper date={timestamp} />
          </TimeStamp>
        </Who>
        <Value>
          <Amount color={color}>{quantity}</Amount>
          <Currency>{CURRENCY_TRANSLATE[tokenType]}</Currency>
        </Value>
      </Line>
    </Root>
  );
}

export default withRouter(RewardLine);
