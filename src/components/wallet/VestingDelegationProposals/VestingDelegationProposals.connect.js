import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { golosSupplySelector, userWalletSelector } from 'store/selectors/wallet';
import { fetchVestingProposals, acceptVestingProposal } from 'store/actions/gate';

import VestingDelegationProposals from './VestingDelegationProposals';

export default connect(
  state => {
    const userId = currentUserIdSelector(state);
    const { balance, supply } = golosSupplySelector(state);

    return {
      userId,
      items: userWalletSelector(userId, 'vestingDelegationProposals')(state),
      balance,
      supply,
    };
  },
  {
    fetchVestingProposals,
    acceptVestingProposal,
  }
)(VestingDelegationProposals);
