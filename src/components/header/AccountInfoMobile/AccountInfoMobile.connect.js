import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import AccountInfoMobile from './AccountInfoMobile';

export default connect(state => {
  const userId = currentUnsafeUserIdSelector(state);

  return {
    userId,
    // TODO: Replace by real votingPower
    votingPower: 50,
  };
})(AccountInfoMobile);
