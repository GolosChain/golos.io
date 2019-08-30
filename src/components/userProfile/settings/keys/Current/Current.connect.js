import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getAccountPermissions } from 'cyber-client/lib/auth';

import Current from './Current';

export default connect(state => {
  const accountData = dataSelector(['chain', 'account'])(state);
  let publicKeys = {};

  if (accountData && accountData.permissions) {
    publicKeys = getAccountPermissions(accountData.permissions);
  }

  return {
    publicKeys,
  };
})(Current);
