import React from 'react';
import { withRouter } from 'next/router';
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

function VestingLine({ vesting }) {
  const { diff, trxId, timestamp, isIrreversible } = vesting;

  const isPowerUp = !diff.GESTS.startsWith('-');

  const title = isPowerUp
    ? tt('user_wallet.content.power_up')
    : tt('user_wallet.content.power_down');

  let color = isPowerUp ? '#f57c02' : null;
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
          <WhoTitle>{title}</WhoTitle>
          <WhoBottom>
            <TimeStamp>
              <TimeAgoWrapper date={timestamp} />
            </TimeStamp>
            <TrxLink trxId={trxId} />
          </WhoBottom>
        </Who>
        <Value>
          <Amount color={color}>{diff.GOLOS}</Amount>
          <Currency>{tt('token_names.VESTING_TOKEN')}</Currency>
        </Value>
      </Line>
    </Wrapper>
  );
}

export default withRouter(VestingLine);
