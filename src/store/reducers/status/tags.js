import { uniq } from 'ramda';

import {
  FETCH_HASHTAGTOP,
  FETCH_HASHTAGTOP_SUCCESS,
  FETCH_HASHTAGTOP_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_HASHTAGTOP:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_HASHTAGTOP_SUCCESS: {
      let order;

      // Если передан sequenceKey и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        order,
        sequenceKey: payload.result.sequenceKey,
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
      };
    }

    case FETCH_HASHTAGTOP_ERROR:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
