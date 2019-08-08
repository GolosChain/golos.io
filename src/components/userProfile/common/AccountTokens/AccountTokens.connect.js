import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  userLiquidBalanceSelector,
  userVestingBalanceSelector,
  userLiquidUnclaimedSelector,
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
      (state, props) => userLiquidUnclaimedSelector(props.userId)(state),
      statusSelector(['wallet', 'isLoading']),
    ],
    (liquid, cyber, vesting, unclaimed, isLoading) => ({
      golos: liquid,
      cyber,
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
