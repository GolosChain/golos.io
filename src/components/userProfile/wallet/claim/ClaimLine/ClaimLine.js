import React from 'react';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import tt from 'counterpart';

import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import TrxLink from 'components/userProfile/wallet/common/TrxLink';

import {
  Wrapper,
  Line,
  LineIcon,
  Who,
  WhoTitle,
  WhoBottom,
  Value,
  Amount,
  Currency,
  TimeStamp,
} from '../../common';

const ValueStyled = styled(Value)`
  flex-basis: initial;
`;

function ClaimLine({ claim }) {
  const { quantity, trxId, timestamp, sym, isIrreversible } = claim;

  let color = '#2879ff';
  let icon = 'logo';
  let tooltipText = null;
  if (!isIrreversible) {
    color = null;
    icon = 'clock';
    tooltipText = tt('g.pending_transaction');
  }

  return (
    <Wrapper isIrreversible={isIrreversible}>
      <Line>
        <LineIcon name={icon} color={color} data-toggle={tooltipText} />
        <Who>
          <WhoTitle>Claim</WhoTitle>
          <WhoBottom>
            <TimeStamp>
              <TimeAgoWrapper date={timestamp} />
            </TimeStamp>
            <TrxLink trxId={trxId} />
          </WhoBottom>
        </Who>
        <ValueStyled>
          <Amount color={color}>{quantity}</Amount>
          <Currency>{sym}</Currency>
        </ValueStyled>
      </Line>
    </Wrapper>
  );
}

export default withRouter(ClaimLine);
