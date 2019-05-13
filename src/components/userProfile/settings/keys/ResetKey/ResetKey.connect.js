import { connect } from 'react-redux';

import { changePassword } from 'store/actions/cyberway/permissions';

import ResetKey from './ResetKey';

export default connect(
  null,
  {
    changePassword,
  }
)(ResetKey);
