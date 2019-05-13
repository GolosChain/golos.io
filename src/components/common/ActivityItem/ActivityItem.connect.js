import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { markAsViewed } from 'store/actions/gate/notifications';
import { fetchComment } from 'store/actions/gate';

import ActivityItem from './ActivityItem';

export default connect(
  (state, props) => ({
    notification: entitySelector('notifications', props.id)(state),
  }),
  {
    markAsViewed,
    fetchComment,
  }
)(ActivityItem);
