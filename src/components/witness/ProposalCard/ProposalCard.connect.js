import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { approveProposal, execProposal } from 'store/actions/cyberway';

import ProposalCard from './ProposalCard';

export default connect(
  state => ({
    userId: currentUserIdSelector(state),
  }),
  {
    approveProposal,
    execProposal,
  }
)(ProposalCard);
