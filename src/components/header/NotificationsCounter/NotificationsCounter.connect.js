import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import NotificationsCounter from './NotificationsCounter';

export default connect(state => ({
  userId: currentUnsafeUserIdSelector(state),
  count: dataSelector(['notifications', 'counter'])(state),
}))(NotificationsCounter);
