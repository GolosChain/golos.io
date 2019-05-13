import { notificationSchema } from 'store/schemas/gate';
import {
  FETCH_ACTIVITY,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_ACTIVITY_ERROR,
} from 'store/constants/actionTypes';
import { ACTIVITIES_PER_PAGE } from 'constants/activities';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchActivities = ({ types = 'all', fromId = null } = {}, meta = {}) => {
  const params = {
    limit: ACTIVITIES_PER_PAGE,
    types,
    markAsViewed: false,
    fromId,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_ACTIVITY, FETCH_ACTIVITY_SUCCESS, FETCH_ACTIVITY_ERROR],
      method: 'notify.getHistory',
      params,
      schema: { data: [notificationSchema] },
    },
    meta: {
      ...params,
      ...meta,
      waitAutoLogin: true,
      abortPrevious: true,
    },
  };
};
