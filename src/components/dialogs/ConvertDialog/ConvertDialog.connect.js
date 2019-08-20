import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserIdSelector } from 'store/selectors/auth';
import {
  userLiquidBalanceSelector,
  userVestingBalanceSelector,
  userCyberStakeBalanceSelector,
} from 'store/selectors/wallet';
import { withdrawTokens, transferToken, withdrawStake } from 'store/actions/cyberway';
import { getBalance, convertTokensToVesting } from 'store/actions/gate';

import ConvertDialog from './ConvertDialog';

export default connect(
  createSelector(
    [
      currentUserIdSelector,
      state => userLiquidBalanceSelector(currentUserIdSelector(state))(state),
      state => userVestingBalanceSelector(currentUserIdSelector(state))(state),
      state => userLiquidBalanceSelector(currentUserIdSelector(state), 'CYBER')(state),
      state => userCyberStakeBalanceSelector(currentUserIdSelector(state), 'staked')(state),
    ],
    (currentUserId, liquid, vesting, cyberBalance, stakedBalance) => ({
      currentUserId,
      balance: liquid,
      powerBalance: vesting.total - vesting.outDelegate,
      cyberBalance,
      stakedBalance,
    })
  ),
  {
    transferToken,
    withdrawTokens,
    withdrawStake,
    getBalance,
    convertTokensToVesting,
  },
  null,
  { forwardRef: true }
)(ConvertDialog);
