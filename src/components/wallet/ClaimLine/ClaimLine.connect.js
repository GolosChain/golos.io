import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserIdSelector } from 'store/selectors/auth';
import { userLiquidUnclaimedBalanceSelector } from 'store/selectors/wallet';
import { claimToken } from 'store/actions/cyberway/cyberToken';

import ClaimLine from './ClaimLine';

export default connect(
  createSelector(
    [
      (state, props) => userLiquidUnclaimedBalanceSelector(props.userId)(state),
      (state, props) => Boolean(props.userId === currentUserIdSelector(state)),
    ],
    (unclaimedBalance, isOwner) => ({
      unclaimedBalance,
      isOwner,
    })
  ),
  {
    claimToken,
  }
)(ClaimLine);
