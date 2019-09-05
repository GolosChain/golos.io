import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import ValidatorsHeader from './ValidatorsHeader';

export default connect(state => {
  const userId = currentUnsafeUserIdSelector(state);
  const profile = entitySelector('profiles', userId)(state);

  return {
    hideLeaderActions: !userId,
    isLoading: Boolean(userId && !profile),
  };
})(ValidatorsHeader);
