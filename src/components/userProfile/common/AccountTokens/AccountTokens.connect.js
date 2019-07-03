import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { userLiquidBalanceSelector, userVestingBalanceSelector } from 'store/selectors/wallet';

import AccountTokens from './AccountTokens';

export default connect(
  createSelector(
    [
      (state, props) => userLiquidBalanceSelector(props.userId)(state),
      (state, props) => userVestingBalanceSelector(props.userId)(state),
    ],
    (liquid, vesting) => ({
      golos: liquid,
      power: vesting.total,
      powerDelegated: vesting.inDelegated,
    })
  )
)(AccountTokens);
