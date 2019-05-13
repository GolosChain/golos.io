import { uniq, last } from 'ramda';

import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  AUTH_LOGOUT_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isFetching: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_NOTIFICATIONS:
      if (meta.fromId && meta.fromId === state.lastId) {
        return {
          ...state,
          isFetching: true,
        };
      }

      return {
        ...initialState,
        isFetching: true,
      };

    case FETCH_NOTIFICATIONS_SUCCESS: {
      let order;

      // Если передан lastId и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.fromId && meta.fromId === state.lastId) {
        order = uniq(state.order.concat(payload.result.data));
      } else {
        order = payload.result.data;
      }

      return {
        ...state,
        order,
        lastId: last(payload.result.data) || state.lastId,
        isFetching: false,
        isEnd: payload.result.data.length < meta.limit,
      };
    }

    case FETCH_NOTIFICATIONS_ERROR:
      return {
        ...state,
        isFetching: false,
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
