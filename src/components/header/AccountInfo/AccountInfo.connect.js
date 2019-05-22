import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { profileSelector } from 'store/selectors/common';

import AccountInfo from './AccountInfo';

export default connect(state => {
  const currentUser = currentUnsafeUserSelector(state);
  let username;

  if (currentUser) {
    const profile = profileSelector(currentUser.userId)(state);
    username = profile.username;
  }

  return {
    userId: currentUser.userId,
    username,
    // TODO: Replace by real votingPower
    votingPower: 50,
  };
})(AccountInfo);
