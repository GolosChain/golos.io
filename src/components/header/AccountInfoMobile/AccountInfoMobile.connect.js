import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';

import AccountInfoMobile from './AccountInfoMobile';

export default connect(state => {
  const currentUser = currentUnsafeUserSelector(state);

  return {
    userId: currentUser.userId,
    // TODO: Replace by real votingPower
    votingPower: 50,
  };
})(AccountInfoMobile);
