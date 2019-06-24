import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { currentUsernameSelector, currentUserIdSelector } from 'store/selectors/auth';
import { getVestingBalance, getVestingParams } from 'store/actions/gate';
import { delegateTokens, stopDelegateTokens } from 'store/actions/cyberway/vesting';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import DelegateDialog from './DelegateDialog';

export default connect(
  state => {
    const currentUsername = currentUsernameSelector(state);
    const userId = currentUserIdSelector(state);
    const vesting = dataSelector(['wallet', userId, 'vesting'])(state);
    const vestingParams = dataSelector(['contractParams', 'vesting'])(state);

    let power;
    let powerDelegated;

    if (vesting && vesting.amount) {
      power = parsePayoutAmount(vesting.amount.GOLOS);
    }

    if (vesting && vesting.deligated) {
      powerDelegated = parsePayoutAmount(vesting.delegated.GOLOS);
    }

    return {
      userId,
      currentUsername,
      power: power || 0,
      powerDelegated: powerDelegated || 0,
      vestingParams,
    };
  },
  {
    delegateTokens,
    stopDelegateTokens,
    getVestingBalance,
    getVestingParams,
  },
  null,
  { forwardRef: true }
)(DelegateDialog);
