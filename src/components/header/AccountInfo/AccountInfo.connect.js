import { connect } from 'react-redux';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { profileSelector, dataSelector } from 'store/selectors/common';
import { fetchChargers } from 'store/actions/gate';

import AccountInfo from './AccountInfo';

export default connect(
  state => {
    const currentUser = currentUnsafeUserSelector(state);
    let username;
    let chargers;

    if (currentUser) {
      ({ username } = profileSelector(currentUser.userId)(state));
      ({ chargers } = dataSelector('auth')(state));
    }

    return {
      userId: currentUser.userId,
      username,
      chargers,
    };
  },
  {
    fetchChargers,
  }
)(AccountInfo);
