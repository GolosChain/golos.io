import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { userLiquidBalanceSelector, userVestingBalanceSelector } from 'store/selectors/wallet';
import { getBalance } from 'store/actions/gate';
import { statusSelector } from 'store/selectors/common';

import AccountTokens from './AccountTokens';

export default connect(
  createSelector(
    [
      (state, props) => userLiquidBalanceSelector(props.userId)(state),
      (state, props) => userVestingBalanceSelector(props.userId)(state),
      statusSelector(['wallet', 'isLoading']),
    ],
    (liquid, vesting, isLoading) => ({
      golos: liquid,
      power: vesting.total,
      powerDelegated: vesting.inDelegated,
      isLoading,
    })
  ),
  {
    getBalance,
  }
)(AccountTokens);
