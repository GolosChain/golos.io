import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';
import { SHOW_MODAL_BECOME_LOADER, SHOW_MODAL_MANAGE_COMMUNITY } from 'store/constants';

import WitnessHeader from './WitnessHeader';

export default connect(state => {
  const userId = currentUnsafeUserIdSelector(state);
  const profile = entitySelector('profiles', userId)(state);

  const isWitness = profile ? profile.leaderIn.includes('gls') : false;

  return {
    hideLeaderActions: !userId,
    isLoading: Boolean(userId && !profile),
    isWitness,
  };
})(WitnessHeader);
