import { uniq } from 'ramda';

import {
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
} from 'store/constants/actionTypes';
import { formatContentId } from 'store/schemas/gate';

const initialState = {
  postId: null,
  order: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_POST_COMMENTS: {
      const postId = formatContentId({ userId: meta.userId, permlink: meta.permlink });

      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey && postId === state.postId) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        postId,
        isLoading: true,
      };
    }

    case FETCH_POST_COMMENTS_SUCCESS: {
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

    case FETCH_POST_COMMENTS_ERROR:
      return { ...state, isLoading: false };

    default:
      return state;
  }
}
