import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';
import { approveProposal, execProposal } from 'store/actions/cyberway';

import ProposalCard from './ProposalCard';

export default connect(
  (state, { fullProposalId }) => ({
    userId: currentUserIdSelector(state),
    proposal: entitySelector('proposals', fullProposalId)(state),
  }),
  {
    approveProposal,
    execProposal,
  }
)(ProposalCard);
