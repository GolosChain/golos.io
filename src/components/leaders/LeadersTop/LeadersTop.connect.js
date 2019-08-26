import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_BECOME_LOADER } from 'store/constants';
import { dataSelector } from 'store/selectors/common';
import { amIWitnessSelector } from 'store/selectors/auth';
import { fetchLeaders } from 'store/actions/gate';
import { stopLeader } from 'store/actions/cyberway';

import LeadersTop from './LeadersTop';

export default connect(
  state => {
    const leaders = dataSelector('leaders')(state);

    return {
      isWitness: amIWitnessSelector(state),
      items: leaders.items,
      isEnd: leaders.isEnd,
      isLoading: leaders.isLoading,
      isError: leaders.isError,
      sequenceKey: leaders.sequenceKey,
    };
  },
  {
    fetchLeaders,
    stopLeader,
    openBecomeLeaderDialog: () => openModal(SHOW_MODAL_BECOME_LOADER),
  }
)(LeadersTop);
