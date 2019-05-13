/* eslint-disable import/prefer-default-export */

import {
  RECORD_POST_VIEW,
  RECORD_POST_VIEW_SUCCESS,
  RECORD_POST_VIEW_ERROR,
  FETCH_POST_VIEW_COUNT,
  FETCH_POST_VIEW_COUNT_SUCCESS,
  FETCH_POST_VIEW_COUNT_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { formatContentId } from 'store/schemas/gate';

export const recordPostView = contentId => {
  const contentUrl = formatContentId(contentId);

  return {
    [CALL_GATE]: {
      types: [RECORD_POST_VIEW, RECORD_POST_VIEW_SUCCESS, RECORD_POST_VIEW_ERROR],
      method: 'meta.recordPostView',
      params: {
        postLink: contentUrl,
      },
    },
    meta: {
      contentUrl,
    },
  };
};

export const fetchPostsViewCount = urls => ({
  [CALL_GATE]: {
    types: [FETCH_POST_VIEW_COUNT, FETCH_POST_VIEW_COUNT_SUCCESS, FETCH_POST_VIEW_COUNT_ERROR],
    method: 'meta.getPostsViewCount',
    params: {
      postLinks: urls,
    },
  },
});

export const fetchPostViewCount = (() => {
  let queue = [];
  let isTimeoutStarted = false;

  return contentUrl => dispatch => {
    queue.push(contentUrl);

    if (!isTimeoutStarted) {
      isTimeoutStarted = true;

      // Отложенный запрос нужен чтобы собрать все запрошенные единичные запросы и объединить их в один
      setTimeout(async () => {
        isTimeoutStarted = false;

        const urls = queue;
        queue = [];

        try {
          await dispatch(fetchPostsViewCount(urls));
        } catch (err) {
          console.error('PostsViewCount request is failed:', err);
        }
      }, 50);
    }
  };
})();
