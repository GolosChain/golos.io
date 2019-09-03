import { connect } from 'react-redux';

import { fetchActivities } from 'store/actions/gate/activities';
import { profileSelector, statusSelector } from 'store/selectors/common';
import { authProtection } from 'helpers/hoc';

import ActivityContent from './ActivityContent';

export default authProtection()(
  connect(
    (state, props) => {
      const profile = profileSelector(props.userId)(state);

      return {
        ...statusSelector('activities')(state),
        profile,
      };
    },
    {
      fetchActivities,
      getNotificationsHistory: () => () => console.error('Unhandled action'),
    }
  )(ActivityContent)
);
