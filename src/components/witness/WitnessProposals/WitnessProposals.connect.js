import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { fetchProposals } from 'store/actions/gate';

import WitnessProposals from './WitnessProposals';

export default connect(
  state => {
    const proposals = dataSelector('proposals')(state);

    return {
      items: proposals.items,
      isEnd: proposals.isEnd,
      isLoading: proposals.isLoading,
      isError: proposals.isError,
      sequenceKey: proposals.sequenceKey,
    };
  },
  {
    fetchProposals,
  }
)(WitnessProposals);
