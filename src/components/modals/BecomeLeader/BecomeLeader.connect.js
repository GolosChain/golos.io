import { connect } from 'react-redux';

import { registerWitness } from 'store/actions/cyberway';
import { currentUserIdSelector } from 'store/selectors/auth';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';

import BecomeLeader from './BecomeLeader';

export default connect(
  state => ({
    userId: currentUserIdSelector(state),
  }),
  {
    registerWitness,
    fetchProfile,
    waitForTransaction,
  }
)(BecomeLeader);
