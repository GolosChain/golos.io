import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { profileSelector } from 'store/selectors/common';

import AccountInfo from './AccountInfo';

export default connect(state => {
  const currentUser = currentUnsafeUserSelector(state);
  let username;
  let chargers;

  if (currentUser) {
    const profile = profileSelector(currentUser.userId)(state);
    ({ username, chargers } = profile);
  }

  return {
    userId: currentUser.userId,
    username,
    chargers,
  };
})(AccountInfo);
