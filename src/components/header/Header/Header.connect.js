import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { dataSelector, uiSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate/auth';

import Header from './Header';

export default connect(
  state => {
    const userId = currentUnsafeUserIdSelector(state);
    const screenType = uiSelector(['mode', 'screenType'])(state);

    return {
      userId,
      isAuthorized: Boolean(userId),
      isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
      screenType,
      isDesktop: screenType === 'desktop',
    };
  },
  {
    logout,
    openModal,
  }
)(Header);
