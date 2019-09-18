import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { amIWitnessSelector } from 'store/selectors/auth';
import { fetchLeaders } from 'store/actions/gate';
import { stopLeader } from 'store/actions/cyberway';
import { showBecomeLeaderDialog } from 'store/actions/modals';

import LeadersTop from './LeadersTop';

export default connect(
  state => {
    const leaders = dataSelector('leaders')(state);

    return {
      isWitness: amIWitnessSelector(state),
      items: leaders.items,
      query: leaders.query,
      isEnd: leaders.isEnd,
      isLoading: leaders.isLoading,
      isError: leaders.isError,
      sequenceKey: leaders.sequenceKey,
    };
  },
  {
    fetchLeaders,
    stopLeader,
    showBecomeLeaderDialog,
  }
)(LeadersTop);
