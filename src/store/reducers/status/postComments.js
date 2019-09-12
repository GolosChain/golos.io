import { uniq } from 'ramda';
import u from 'updeep';

import {
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
} from 'store/constants/actionTypes';
import { formatContentId } from 'store/schemas/gate';

const initialPostCommentState = {
  order: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
};

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_POST_COMMENTS: {
      const postId = formatContentId({ userId: meta.userId, permlink: meta.permlink });

      if (meta.sequenceKey && meta.sequenceKey === state[postId].sequenceKey) {
        return u.updateIn(postId, { isLoading: true }, state);
      }

      return u.updateIn(postId, { ...initialPostCommentState, isLoading: true }, state);
    }

    // if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
    //   return {
    //     ...state,
    //     isLoading: true,
    //   };
    // }
    //
    // return {
    //   ...initialState,
    //   isLoading: true,
    // };

    case FETCH_POST_COMMENTS_SUCCESS: {
      const postId = formatContentId({ userId: meta.userId, permlink: meta.permlink });
      let order;

      // Если передан sequenceKey и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.sequenceKey && meta.sequenceKey === state[postId].sequenceKey) {
        order = uniq(state[postId].order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }
      //
      // return {
      //   ...state,
      //   isLoading: false,
      //   order,
      //   sequenceKey: payload.result.sequenceKey,
      //   isEnd: payload.result.items.length < meta.limit,
      // };

      return u.updateIn(
        postId,
        {
          isLoading: false,
          order,
          // order: items => [...items, ...payload.result.items],
          sequenceKey: payload.result.sequenceKey || null,
          isEnd: payload.result.items.length < meta.limit,
        },
        state
      );
    }

    case FETCH_POST_COMMENTS_ERROR: {
      const postId = formatContentId({ userId: meta.userId, permlink: meta.permlink });
      // return { ...state, isLoading: false };

      return u.updateIn(postId, { isLoading: false }, state);
    }

    default:
      return state;
  }
}
