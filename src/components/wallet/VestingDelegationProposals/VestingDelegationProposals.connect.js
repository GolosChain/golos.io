import { connect } from 'react-redux';

import { golosSupplySelector, userWalletSelector } from 'store/selectors/wallet';
import { approveProposal, execProposal } from 'store/actions/cyberway';

import VestingDelegationProposals from './VestingDelegationProposals';

export default connect(
  (state, props) => {
    const { balance, supply } = golosSupplySelector(state);

    return {
      items: userWalletSelector(props.userId, 'vestingDelegationProposals')(state),
      balance,
      supply,
    };
  },
  {
    approveProposal,
    execProposal,
  }
)(VestingDelegationProposals);
