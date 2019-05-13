import { uniq, last } from 'ramda';

import {
  FETCH_ACTIVITY,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_ACTIVITY_ERROR,
  AUTH_LOGOUT_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  lastId: null,
  isLoading: false,
  tabLoading: null,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_ACTIVITY:
      if (meta.fromId && meta.fromId === state.lastId) {
        return {
          ...state,
          isLoading: true,
          tabLoading: null,
        };
      }

      return {
        ...state,
        isLoading: true,
        tabLoading: meta.tabId,
      };

    case FETCH_ACTIVITY_SUCCESS: {
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
        isLoading: false,
        tabLoading: null,
        isEnd: payload.result.data.length < meta.limit,
      };
    }

    case FETCH_ACTIVITY_ERROR:
      // Если передан lastId и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.fromId && meta.fromId === state.lastId) {
        return {
          ...state,
          isLoading: false,
          tabLoading: null,
        };
      }

      return initialState;

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
