import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserIdSelector } from 'store/selectors/auth';
import { userLiquidBalanceSelector, userVestingBalanceSelector } from 'store/selectors/wallet';
import { withdrawTokens, transferToken } from 'store/actions/cyberway';
import { getBalance, convertTokensToVesting } from 'store/actions/gate';

import ConvertDialog from './ConvertDialog';

export default connect(
  createSelector(
    [
      currentUserIdSelector,
      state => userLiquidBalanceSelector(currentUserIdSelector(state))(state),
      state => userVestingBalanceSelector(currentUserIdSelector(state))(state),
    ],
    (currentUserId, liquid, vesting) => ({
      currentUserId,
      balance: liquid,
      powerBalance: vesting.total - vesting.outDelegate,
    })
  ),
  {
    transferToken,
    withdrawTokens,
    getBalance,
    convertTokensToVesting,
  },
  null,
  { forwardRef: true }
)(ConvertDialog);
