import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { currentUserSelector } from 'store/selectors/auth';
import { login } from 'store/actions/gate/auth';

import LoginPanel from './LoginPanel';

export default connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
  }),
  {
    login,
  }
)(LoginPanel);
