import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import LeadersHeader from './LeadersHeader';

export default connect(state => {
  const userId = currentUnsafeUserIdSelector(state);
  const profile = entitySelector('profiles', userId)(state);

  const isWitness = profile ? profile.leaderIn.includes('gls') : false;

  return {
    hideLeaderActions: !userId,
    isLoading: Boolean(userId && !profile),
    isWitness,
  };
})(LeadersHeader);
