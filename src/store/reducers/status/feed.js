import { uniq } from 'ramda';

import {
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
  REMOVE_REBLOG_POST_SUCCESS,
} from 'store/constants/actionTypes';
import { formatContentId } from '../../schemas/gate';

const initialState = {
  query: {},
  order: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
  error: null,
};

export default function(state = initialState, { type, payload, error, meta }) {
  switch (type) {
    case FETCH_POSTS:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_POSTS_SUCCESS: {
      let order;

      // Если передан sequenceKey и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        query: meta,
        order,
        sequenceKey: payload.result.sequenceKey,
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
        error: null,
      };
    }

    case FETCH_POSTS_ERROR:
      return {
        ...state,
        isLoading: false,
        error,
      };

    case REMOVE_REBLOG_POST_SUCCESS:
      const contentId = formatContentId(meta.contentId);

      if (state.query.userId === meta.userId) {
        return {
          ...state,
          order: state.order.filter(id => id !== contentId),
        };
      }

      return state;

    default:
      return state;
  }
}
