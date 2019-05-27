import { connect } from 'react-redux';

import { voteWitness, unvoteWitness } from 'store/actions/cyberway/ctrl';

import WitnessesLine from './WitnessesLine';

export default connect(
  null,
  {
    voteWitness,
    unvoteWitness,
  }
)(WitnessesLine);
