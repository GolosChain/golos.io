import { connect } from 'react-redux';

import { userBalanceSelector, golosSupplySelector } from 'store/selectors/wallet';
import { approveProposal, execProposal } from 'store/actions/cyberway';

import VestingDelegationProposals from './VestingDelegationProposals';

export default connect(
  (state, props) => {
    const { balance, supply } = golosSupplySelector(state);

    return {
      items: userBalanceSelector(props.userId)(state)?.vestingDelegationProposals,
      balance,
      supply,
    };
  },
  {
    approveProposal,
    execProposal,
  }
)(VestingDelegationProposals);
