import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { dataSelector, uiSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate/auth';

import Header from './Header';

export default connect(
  state => {
    const currentUser = currentUnsafeUserSelector(state);

    return {
      userId: currentUser?.userId,
      username: currentUser?.username,
      isAuthorized: Boolean(currentUser),
      isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
      screenType: uiSelector(['mode', 'screenType'])(state),
    };
  },
  {
    logout,
    openModal,
  }
)(Header);
