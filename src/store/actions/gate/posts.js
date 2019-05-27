import { postSchema, formatContentId } from 'store/schemas/gate';
import { POSTS_FETCH_LIMIT } from 'shared/constants';
import {
  FETCH_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_ERROR,
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
  FETCH_POST_VOTES,
  FETCH_POST_VOTES_SUCCESS,
  FETCH_POST_VOTES_ERROR,
} from 'store/constants/actionTypes';
import { entitySelector } from 'store/selectors/common';
import { currentUnsafeServerUserIdSelector } from 'store/selectors/auth';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchPost = contentId => ({
  [CALL_GATE]: {
    types: [FETCH_POST, FETCH_POST_SUCCESS, FETCH_POST_ERROR],
    method: 'content.getPost',
    params: {
      contentType: 'raw',
      ...contentId,
    },
    schema: postSchema,
  },
  meta: contentId,
});

export const fetchPostIfNeeded = contentId => (dispatch, getState) => {
  if (!entitySelector('posts', formatContentId(contentId))(getState())) {
    return dispatch(fetchPost(contentId));
  }
  return null;
};

export const fetchPosts = ({ type, id, feedType, sequenceKey = null, tags = null }) => (
  dispatch,
  getState
) => {
  const userId = currentUnsafeServerUserIdSelector(getState());

  const newParams = {
    contentType: 'raw',
    sortBy: 'timeDesc',
    limit: POSTS_FETCH_LIMIT,
    userId,
  };

  if (type === 'community') {
    newParams.type = 'community';
    newParams.communityId = 'gls';

    switch (feedType) {
      case 'created':
        newParams.sortBy = 'timeDesc';
        break;
      case 'hot':
        newParams.sortBy = 'popular';
        newParams.timeframe = 'WilsonHot';
        break;
      default:
        newParams.sortBy = 'popular';
        newParams.timeframe = 'WilsonTrending';
        break;
    }
  } else if (type === 'user') {
    newParams.type = 'byUser';
    newParams.userId = id;
  } else {
    throw new Error('Invalid fetch posts type');
  }

  if (sequenceKey) {
    newParams.sequenceKey = sequenceKey;
  }

  if (tags && tags.length) {
    newParams.tags = tags;
  }

  if (!userId && !id) {
    delete newParams.userId;
  }

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR],
      method: 'content.getFeed',
      params: newParams,
      schema: {
        items: [postSchema],
      },
    },
    meta: newParams,
  });
};

export const fetchPostVotes = (contentId, type = 'like', sequenceKey = null, limit = 20) => {
  const params = {
    ...contentId,
    type,
    sequenceKey,
    limit,
  };
  return {
    [CALL_GATE]: {
      types: [FETCH_POST_VOTES, FETCH_POST_VOTES_SUCCESS, FETCH_POST_VOTES_ERROR],
      method: 'content.getPostVotes',
      params,
    },
    meta: {
      contentId,
      type,
      sequenceKey,
      limit,
    },
  };
};
