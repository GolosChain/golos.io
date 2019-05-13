import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';

import AccountInfo from './AccountInfo';

export default connect(state => {
  const currentUser = currentUnsafeUserSelector(state);

  return {
    userId: currentUser.userId,
    name: currentUser.username || currentUser.userId,
    // TODO: Replace by real votingPower
    votingPower: 50,
  };
})(AccountInfo);
