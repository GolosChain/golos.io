import { connect } from 'react-redux';

import { login } from 'store/actions/gate/auth';

import LoginForm from './LoginForm';

export default connect(
  () => ({
    loginError: null,
    currentUsername: null,
  }),
  {
    login,
  },
  null,
  { forwardRef: true }
)(LoginForm);
