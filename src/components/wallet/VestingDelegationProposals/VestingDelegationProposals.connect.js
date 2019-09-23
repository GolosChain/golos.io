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

    const data = userWalletSelector(userId, 'vestingProposals')(state);

    return {
      userId,
      items: data?.items,
      balance,
      supply,
    };
  },
  {
    fetchVestingProposals,
    acceptTokensDelegation,
  }
)(VestingDelegationProposals);
