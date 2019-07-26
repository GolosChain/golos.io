import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';
import { approveProposal, execProposal } from 'store/actions/cyberway';

import ProposalCard from './ProposalCard';

export default connect(
  (state, { proposalId }) => ({
    userId: currentUserIdSelector(state),
    proposal: entitySelector('proposals', proposalId)(state),
  }),
  {
    approveProposal,
    execProposal,
  }
)(ProposalCard);
