import { connect } from 'react-redux';
import { getAccountPermissions } from 'cyber-client/lib/auth';

import { currentUserIdSelector } from 'store/selectors/auth';
import { entitySelector, dataSelector } from 'store/selectors/common';
import { changePassword } from 'store/actions/cyberway/permissions';

import ResetKey from './ResetKey';

export default connect(
  state => {
    const userId = currentUserIdSelector(state);
    const user = entitySelector('users', userId)(state);
    const permissions = dataSelector(['chain', 'account'])(state)?.permissions || null;
    const publicKeys = permissions ? getAccountPermissions(permissions) : {};

    return {
      userId,
      username: user?.username,
      permissions,
      publicKeys,
    };
  },
  {
    changePassword,
  }
)(ResetKey);
