import { connect } from 'react-redux';

import { voteWitness, unvoteWitness } from 'store/actions/cyberway/ctrl';

import LeaderLine from './LeaderLine';

export default connect(
  null,
  {
    voteWitness,
    unvoteWitness,
  }
)(LeaderLine);
