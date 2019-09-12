import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { entitySelector, dataSelector } from 'store/selectors/common';

import AccountInfo from './AccountInfo';

export default connect(
  state => {
    const currentUser = currentUnsafeUserSelector(state);
    let username;
    let chargers;

    if (currentUser) {
      username = entitySelector('users', currentUser.userId)(state)?.username;
      chargers = dataSelector('auth')(state).chargers;
    }

    return {
      userId: currentUser.userId,
      username,
      chargers,
    };
  },
  null
)(AccountInfo);
