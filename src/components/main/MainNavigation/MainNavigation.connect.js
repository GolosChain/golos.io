import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { uiSelector, entitySelector } from 'store/selectors/common';

import MainNavigation from './MainNavigation';

export default withRouter(
  connect(state => {
    const userId = currentUnsafeUserIdSelector(state);

    return {
      userId,
      username: userId ? entitySelector('users', userId)(state)?.username : null,
      isMobile: uiSelector(['mode', 'screenType'])(state) === 'mobile',
    };
  })(MainNavigation)
);
