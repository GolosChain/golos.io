import { connect } from 'react-redux';

import { fetchActivities } from 'store/actions/gate/activities';
import { statusSelector } from 'store/selectors/common';
import { authProtection } from 'helpers/hoc';

import ActivityContent from './ActivityContent';

export default authProtection()(
  connect(
    statusSelector('activities'),
    {
      fetchActivities,
      getNotificationsHistory: () => () => console.error('Unhandled action'),
    }
  )(ActivityContent)
);
