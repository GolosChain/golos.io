import React from 'react';
import tt from 'counterpart';

import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import TrxLink from 'components/userProfile/wallet/common/TrxLink';

import {
  Wrapper,
  Line,
  LineIcon,
  Who,
  WhoBottom,
  Value,
  Amount,
  Currency,
  TimeStamp,
} from '../../common';

import RewardContentLink from '../RewardContentLink';

export default function RewardLine({ reward }) {
  const { trxId, timestamp, tokenType, type, contentId, quantity, isIrreversible } = reward;

  let color = '#f57c02';
  let icon = 'logo';
  switch (type) {
    case 'curators':
      icon = 'k';
      break;
    case 'author':
      icon = 'a';
      break;
  }

  let tooltipText = null;
  if (!isIrreversible) {
    color = null;
    icon = 'clock';
    tooltipText = tt('g.pending_transaction');
  }

  const CURRENCY_TRANSLATE = {
    liquid: tt('token_names.LIQUID_TOKEN'),
    vesting: tt('token_names.VESTING_TOKEN'),
  };

  return (
    <Wrapper isIrreversible={isIrreversible}>
      <Line>
        <LineIcon name={icon} color={color} data-tooltip={tooltipText} />
        <Who>
          {contentId ? <RewardContentLink contentId={contentId} /> : null}
          <WhoBottom>
            <TimeStamp>
              <TimeAgoWrapper date={timestamp} />
            </TimeStamp>
            <TrxLink trxId={trxId} />
          </WhoBottom>
        </Who>
        <Value>
          <Amount color={color}>{quantity}</Amount>
          <Currency>{CURRENCY_TRANSLATE[tokenType]}</Currency>
        </Value>
      </Line>
    </Wrapper>
  );
}
