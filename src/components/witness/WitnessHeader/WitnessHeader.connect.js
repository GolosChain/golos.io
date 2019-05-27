import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { loggedProfileSelector } from 'store/selectors/auth';
import { SHOW_MODAL_BECOME_LOADER } from 'store/constants';

import WitnessHeader from './WitnessHeader';

export default connect(
  state => {
    const profile = loggedProfileSelector(state);
    const isWitness = profile ? profile.leaderIn.includes('gls') : false;

    return {
      isLoading: !profile,
      isWitness,
    };
  },
  {
    openBecomeLeaderDialog: () => openModal(SHOW_MODAL_BECOME_LOADER),
  }
)(WitnessHeader);
