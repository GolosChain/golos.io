import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { amIWitnessSelector } from 'store/selectors/auth';
import { fetchProposals } from 'store/actions/gate';
import { openManageCommunityDialog, openCustomProposalDialog } from 'store/actions/modals';

import LeaderProposals from './LeaderProposals';

export default connect(
  state => {
    const proposals = dataSelector('proposals')(state);

    return {
      isWitness: amIWitnessSelector(state),
      items: proposals.items,
      isEnd: proposals.isEnd,
      isLoading: proposals.isLoading,
      isError: proposals.isError,
      sequenceKey: proposals.sequenceKey,
    };
  },
  {
    fetchProposals,
    openManageCommunityDialog,
    openCustomProposalDialog,
  }
)(LeaderProposals);
