import React from 'react';
import tt from 'counterpart';

import SmartLink from 'components/common/SmartLink';

import { Line, LineIcon, Who, WhoName, Value, Amount, Currency } from '../../common';

export default function VestingDelegationsLine({ delegation, currentUserId }) {
  const [amount] = delegation.quantity.GOLOS.split(' ');

  let accountLabel;
  let accountRoute;

  if (currentUserId && currentUserId === delegation.from) {
    accountLabel = 'user_wallet.content.to';
    accountRoute = { userId: delegation.to, username: delegation.toUsername };
  } else {
    accountLabel = 'user_wallet.content.from';
    accountRoute = { userId: delegation.from, username: delegation.fromUsername };
  }

  return (
    <Line>
      <LineIcon name="logo" color="#f57c02" />
      <Who>
        <WhoName>
          {tt(accountLabel)}{' '}
          <SmartLink route="profile" params={accountRoute}>
            {accountRoute.username ? `@${accountRoute.username}` : accountRoute.userId}
          </SmartLink>
        </WhoName>
      </Who>
      <Value>
        <Amount color="#f57c02">{amount}</Amount>
        <Currency>{tt('token_names.VESTING_TOKEN')}</Currency>
      </Value>
    </Line>
  );
}
