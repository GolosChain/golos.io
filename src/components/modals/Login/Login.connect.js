import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { login } from 'store/actions/gate/auth';
import { openConfirmDialog } from 'store/actions/modals';

import Login from './Login';

export default connect(
  null,
  {
    login,
    openModal,
    openConfirmDialog,
  }
)(Login);
