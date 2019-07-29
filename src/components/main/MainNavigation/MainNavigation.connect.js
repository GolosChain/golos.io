import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';

import MainNavigation from './MainNavigation';

export default withRouter(
  connect(state => {
    const loggedUser = currentUnsafeUserSelector(state);

    return {
      loggedUsername: loggedUser?.username,
      isMobile: uiSelector(['mode', 'screenType'])(state) === 'mobile',
    };
  })(MainNavigation)
);
