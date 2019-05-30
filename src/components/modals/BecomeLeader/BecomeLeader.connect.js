import { connect } from 'react-redux';

import { registerWitness } from 'store/actions/cyberway';

import BecomeLeader from './BecomeLeader';

export default connect(
  null,
  {
    registerWitness,
  }
)(BecomeLeader);
