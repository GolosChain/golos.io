import { connect } from 'react-redux';

import { getUserStatus } from 'helpers/users';
import { entitySelector } from 'store/selectors/common';

import UserStatus from './UserStatus';

export default connect((state, props) => {
  // mocked data
  // const profile = entitySelector('profile', props);
  const power = parseFloat('800000').toFixed(3);

  return {
    userStatus: getUserStatus(power),
    power,
  };
})(UserStatus);
