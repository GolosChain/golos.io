import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  userLiquidBalanceSelector,
  userVestingBalanceSelector,
  userLiquidUnclaimedBalanceSelector,
  userCyberStakeBalanceSelector,
} from 'store/selectors/wallet';
import { getBalance } from 'store/actions/gate';
import { statusSelector } from 'store/selectors/common';

import AccountTokens from './AccountTokens';

export default connect(
  createSelector(
    [
      (state, props) => userLiquidBalanceSelector(props.userId)(state),
      (state, props) => userLiquidBalanceSelector(props.userId, 'CYBER')(state),
      (state, props) => userVestingBalanceSelector(props.userId)(state),
      (state, props) => userLiquidUnclaimedBalanceSelector(props.userId)(state),
      (state, props) => ({
        staked: userCyberStakeBalanceSelector(props.userId, 'staked')(state),
        received: userCyberStakeBalanceSelector(props.userId, 'received')(state),
        provided: userCyberStakeBalanceSelector(props.userId, 'provided')(state),
      }),
      statusSelector(['wallet', 'isLoading']),
    ],
    (liquid, cyber, vesting, unclaimed, cyberStake, isLoading) => ({
      golos: liquid,
      cyber,
      cyberStake,
      power: vesting.total,
      powerDelegated: vesting.inDelegated,
      unclaimed,
      isLoading,
    })
  ),
  {
    getBalance,
  }
)(AccountTokens);
