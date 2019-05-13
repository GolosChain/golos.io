/* eslint-disable no-underscore-dangle */

import { path, map } from 'ramda';

import {
  AUTH_LOGOUT_SUCCESS,
  MARK_NOTIFICATION_VIEWED_SUCCESS,
  MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
} from 'store/constants';
import { mergeEntities } from 'utils/store';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = path(['entities', 'notifications'], payload);

  if (entities) {
    return mergeEntities(state, entities, {
      transform: notification => {
        const data = {
          ...notification,
          id: notification._id,
        };

        delete data._id;

        return data;
      },
    });
  }

  switch (type) {
    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    case MARK_NOTIFICATION_VIEWED_SUCCESS: {
      const updated = {};

      for (const id of meta.ids) {
        const notification = state[id];

        if (notification) {
          updated[id] = {
            ...notification,
            fresh: false,
          };
        }
      }

      return {
        ...state,
        ...updated,
      };
    }

    case MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS:
      return map(
        activity => ({
          ...activity,
          fresh: false,
        }),
        state
      );

    default:
      return state;
  }
}
