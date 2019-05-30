import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_MANAGE_COMMUNITY } from '/store/constants';
import { dataSelector } from 'store/selectors/common';
import { amIWitnessSelector } from 'store/selectors/auth';
import { fetchProposals } from 'store/actions/gate';

import WitnessProposals from './WitnessProposals';

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
    openManageCommunityDialog: () => openModal(SHOW_MODAL_MANAGE_COMMUNITY),
  }
)(WitnessProposals);
