import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { changePassword } from 'store/actions/cyberway/permissions';

import ResetKey from './ResetKey';

export default connect(
  state => ({
    userId: currentUserIdSelector(state),
  }),
  {
    changePassword,
  }
)(ResetKey);
