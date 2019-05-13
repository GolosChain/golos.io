/* eslint-disable import/prefer-default-export */

import { repliesSchema } from 'store/schemas/gate';
import { FEED_PAGE_SIZE } from 'shared/constants';
import {
  FETCH_USER_REPLIES,
  FETCH_USER_REPLIES_SUCCESS,
  FETCH_USER_REPLIES_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchReplies = ({ userId, sequenceKey }) => {
  const newParams = {
    type: 'replies',
    sortBy: 'time',
    limit: FEED_PAGE_SIZE,
    sequenceKey: sequenceKey || null,
    userId,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_USER_REPLIES, FETCH_USER_REPLIES_SUCCESS, FETCH_USER_REPLIES_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [repliesSchema],
      },
    },
    meta: newParams,
  };
};
