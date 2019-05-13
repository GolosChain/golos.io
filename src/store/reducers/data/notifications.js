import {
  FETCH_NOTIFICATIONS,
  AUTH_LOGOUT_SUCCESS,
  MARK_NOTIFICATION_VIEWED_SUCCESS,
  MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
  FETCH_NOTIFICATIONS_COUNT_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  counter: 0,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_NOTIFICATIONS:
      if (!meta.fromId || meta.fromId !== state.lastId) {
        return initialState;
      }

      return state;

    case FETCH_NOTIFICATIONS_COUNT_SUCCESS:
      return {
        counter: payload.fresh,
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    case MARK_NOTIFICATION_VIEWED_SUCCESS:
      return {
        counter: Math.max(0, state.counter - 1),
      };

    case MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS:
      return {
        counter: 0,
      };

    default:
      return state;
  }
}
