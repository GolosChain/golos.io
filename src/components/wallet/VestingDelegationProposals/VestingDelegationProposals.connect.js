import { connect } from 'react-redux';

import { userBalanceSelector } from 'store/selectors/wallet';
import { approveProposal, execProposal } from 'store/actions/cyberway';

import VestingDelegationProposals from './VestingDelegationProposals';

export default connect(
  (state, props) => ({
    items: userBalanceSelector(props.userId)(state)?.vestingDelegationProposals,
  }),
  {
    approveProposal,
    execProposal,
  }
)(VestingDelegationProposals);
