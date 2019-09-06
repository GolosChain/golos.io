import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import AccountInfoMobile from './AccountInfoMobile';

export default connect(state => {
  const currentUser = currentUnsafeUserSelector(state);

  const user = entitySelector('users', currentUser.userId)(state);

  return {
    userId: currentUser.userId,
    username: user?.username,
    // TODO: Replace by real votingPower
    votingPower: 50,
  };
})(AccountInfoMobile);
