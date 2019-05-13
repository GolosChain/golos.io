import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'store/selectors/auth';

import LoginContainer from './LoginContainer';

export default connect(
  createSelector(
    [currentUsernameSelector],
    username => ({ username })
  )
)(LoginContainer);
