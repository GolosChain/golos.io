import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { golosSupplySelector, userWalletSelector } from 'store/selectors/wallet';
import { fetchVestingProposals } from 'store/actions/gate';
import { acceptTokensDelegation } from 'store/actions/complex/vesting';

import VestingDelegationProposals from './VestingDelegationProposals';

export default connect(
  state => {
    const userId = currentUserIdSelector(state);
    const { balance, supply } = golosSupplySelector(state);

    const items = userWalletSelector(userId, 'vestingDelegationProposals')(state);

    return {
      userId,
      items,
      balance,
      supply,
    };
  },
  {
    fetchVestingProposals,
    acceptTokensDelegation,
  }
)(VestingDelegationProposals);
