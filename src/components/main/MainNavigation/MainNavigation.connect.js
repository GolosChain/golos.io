import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';

import MainNavigation from './MainNavigation';

export default withRouter(
  connect(state => ({
    loggedUserId: currentUnsafeUserIdSelector(state),
    isMobile: uiSelector(['mode', 'screenType'])(state) === 'mobile',
  }))(MainNavigation)
);
