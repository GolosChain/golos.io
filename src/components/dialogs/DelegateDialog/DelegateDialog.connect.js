import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { currentUsernameSelector, currentUserIdSelector } from 'store/selectors/auth';
import { userVestingBalanceSelector } from 'store/selectors/wallet';
import {
  getVestingParams,
  convertTokensToVesting,
  getDelegationState,
  waitForTransaction,
} from 'store/actions/gate';
import { delegateTokens } from 'store/actions/complex/vesting';
import { undelegateTokens } from 'store/actions/cyberway/vesting';

import DelegateDialog from './DelegateDialog';

export default connect(
  state => {
    const currentUsername = currentUsernameSelector(state);
    const userId = currentUserIdSelector(state);
    const vesting = userVestingBalanceSelector(userId)(state);
    const vestingParams = dataSelector(['contractParams', 'vesting'])(state);

    return {
      currentUserId: userId,
      currentUsername,
      power: vesting.total,
      powerDelegated: vesting.outDelegate,
      vestingParams,
    };
  },
  {
    delegateTokens,
    undelegateTokens,
    getVestingParams,
    convertTokensToVesting,
    getDelegationState,
    waitForTransaction,
  },
  null,
  { forwardRef: true }
)(DelegateDialog);
