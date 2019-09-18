import { connect } from 'react-redux';

import { golosSupplySelector } from 'store/selectors/wallet';
import { voteWitness, unvoteWitness } from 'store/actions/cyberway/ctrl';

import LeaderLine from './LeaderLine';

export default connect(
  state => ({
    supply: golosSupplySelector(state).supply,
  }),
  {
    voteWitness,
    unvoteWitness,
  }
)(LeaderLine);
