import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_BECOME_LOADER } from 'store/constants';
import { dataSelector } from 'store/selectors/common';
import { amIWitnessSelector } from 'store/selectors/auth';
import { fetchLeaders } from 'store/actions/gate';
import { stopLeader } from 'store/actions/cyberway';

import WitnessesTop from './WitnessesTop';

export default connect(
  state => {
    const witness = dataSelector('witness')(state);

    return {
      isWitness: amIWitnessSelector(state),
      items: witness.items,
      isEnd: witness.isEnd,
      isLoading: witness.isLoading,
      isError: witness.isError,
      sequenceKey: witness.sequenceKey,
    };
  },
  {
    fetchLeaders,
    stopLeader,
    openBecomeLeaderDialog: () => openModal(SHOW_MODAL_BECOME_LOADER),
  }
)(WitnessesTop);
