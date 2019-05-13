import { uniq, reverse } from 'ramda';

import {
  FETCH_USER_REPLIES,
  FETCH_USER_REPLIES_SUCCESS,
  FETCH_USER_REPLIES_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USER_REPLIES:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_USER_REPLIES_SUCCESS: {
      let order;

      // Если передан sequenceKey и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        order: reverse(order),
        sequenceKey: payload.result.sequenceKey,
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
      };
    }

    case FETCH_USER_REPLIES_ERROR:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
