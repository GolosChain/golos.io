import { connect } from 'react-redux';

import { statusSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { fetchNotifications, markAllViewed } from 'store/actions/gate/notifications';

import NotificationsWindow from './NotificationsWindow';

export default connect(
  state => {
    const currentUser = currentUnsafeUserSelector(state);
    const status = statusSelector('notifications')(state);

    return {
      order: status.order,
      isFetching: status.isFetching,
      canLoadMore: !status.isFetching && !status.isEnd,
      lastId: status.lastId,
      username: currentUser?.username,
    };
  },
  {
    fetchNotifications,
    markAllViewed,
  }
)(NotificationsWindow);
