import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { fetchActivities } from 'store/actions/gate/activities';
import { statusSelector, dataSelector } from 'store/selectors/common';
import { authProtection } from 'helpers/hoc';

import ActivityContent from './ActivityContent';

export default compose(
  authProtection(),
  withRouter,
  connect(
    (state, { router }) => {
      const { username } = router.query;
      const activitiesStatus = statusSelector('activities')(state);
      const userId = dataSelector(['usernames', username])(state);

      return {
        userId,
        username,
        order: activitiesStatus.order,
        lastId: activitiesStatus.lastId,
        isLoading: activitiesStatus.isLoading,
        tabLoading: activitiesStatus.tabLoading,
        isEnd: activitiesStatus.isEnd,
      };
    },
    {
      fetchActivities,
      getNotificationsHistory: () => () => console.error('Unhandled action'),
    }
  )
)(ActivityContent);
