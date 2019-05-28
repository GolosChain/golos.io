/* eslint-disable import/prefer-default-export */

import { commentSchema, profileCommentSchema } from 'store/schemas/gate';
import { FEED_PAGE_SIZE, SORT_BY_NEWEST, SORT_BY_OLDEST } from 'shared/constants';
import {
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
  FETCH_FEED_COMMENTS,
  FETCH_FEED_COMMENTS_SUCCESS,
  FETCH_FEED_COMMENTS_ERROR,
  FETCH_COMMENT,
  FETCH_COMMENT_SUCCESS,
  FETCH_COMMENT_ERROR,
  FETCH_COMMENT_VOTES,
  FETCH_COMMENT_VOTES_SUCCESS,
  FETCH_COMMENT_VOTES_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchComment = contentId => async dispatch => {
  const newParams = {
    ...contentId,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_COMMENT, FETCH_COMMENT_SUCCESS, FETCH_COMMENT_ERROR],
      method: 'content.getComment',
      params: newParams,
    },
    meta: newParams,
  });
};
export const fetchPostComments = ({
  contentId,
  sequenceKey = null,
  sortBy = SORT_BY_OLDEST,
}) => async dispatch => {
  const newParams = {
    type: 'post',
    sortBy,
    limit: FEED_PAGE_SIZE,
    sequenceKey,
    ...contentId,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POST_COMMENTS, FETCH_POST_COMMENTS_SUCCESS, FETCH_POST_COMMENTS_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [commentSchema],
      },
    },
    meta: newParams,
  });
};

export const fetchUserComments = ({ userId, sequenceKey = null, sortBy = SORT_BY_NEWEST }) => {
  const newParams = {
    type: 'user',
    sortBy,
    limit: FEED_PAGE_SIZE,
    sequenceKey,
    userId,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_FEED_COMMENTS, FETCH_FEED_COMMENTS_SUCCESS, FETCH_FEED_COMMENTS_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [profileCommentSchema],
      },
    },
    meta: newParams,
  };
};
