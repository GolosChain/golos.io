import React from 'react';
import tt from 'counterpart';

import SmartLink from 'components/common/SmartLink';

import { Line, LineIcon, Who, WhoName, Value, Amount, Currency } from '../../common';

export default function VestingDelegationsLine({ delegation }) {
  const [amount] = delegation.quantity.GOLOS.split(' ');

  return (
    <Line>
      <LineIcon name="logo" color="#f57c02" />
      <Who>
        <WhoName>
          {tt('user_wallet.content.from')}{' '}
          <SmartLink
            route="profile"
            params={{ userId: delegation.from, username: delegation.fromUsername }}
          >
            {delegation.fromUsername ? `@${delegation.fromUsername}` : delegation.from}
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
