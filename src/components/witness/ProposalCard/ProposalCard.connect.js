import { connect } from 'react-redux';

import { approveProposal } from 'store/actions/cyberway';

import ProposalCard from './ProposalCard';

export default connect(
  null,
  {
    approveProposal,
  }
)(ProposalCard);
