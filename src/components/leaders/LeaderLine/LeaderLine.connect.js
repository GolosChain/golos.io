import { connect } from 'react-redux';

import { voteWitness, unvoteWitness } from 'store/actions/cyberway/ctrl';
import { dataSelector } from 'store/selectors/common';

import LeaderLine from './LeaderLine';

export default connect(
  state => ({
    supply: dataSelector(['wallet', 'supply'])(state),
  }),
  {
    voteWitness,
    unvoteWitness,
  }
)(LeaderLine);
