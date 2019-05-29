/* eslint-disable import/prefer-default-export */

import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  FETCH_LEADERS,
  FETCH_LEADERS_SUCCESS,
  FETCH_LEADERS_ERROR,
  FETCH_FOLLOWING,
  FETCH_FOLLOWING_SUCCESS,
  FETCH_FOLLOWING_ERROR,
  FETCH_FOLLOWERS,
  FETCH_FOLLOWERS_SUCCESS,
  FETCH_FOLLOWERS_ERROR,
} from 'store/constants';

export const waitForTransaction = transactionId => {
  const params = {
    transactionId,
  };

  return {
    [CALL_GATE]: {
      method: 'content.waitForTransaction',
      params,
    },
    meta: params,
  };
};

export const fetchLeaders = ({ sequenceKey } = {}) => {
  const params = {
    communityId: 'gls',
    limit: 20,
    sequenceKey,
  };

  return {
    [CALL_GATE]: {
      method: 'content.getLeadersTop',
      types: [FETCH_LEADERS, FETCH_LEADERS_SUCCESS, FETCH_LEADERS_ERROR],
      params,
    },
    meta: {
      ...params,
      abortPrevious: true,
      waitAutoLogin: true,
    },
  };
};

export const getSubscriptions = ({ userId, sequenceKey } = {}) => {
  const params = {
    userId,
    limit: 20,
    sequenceKey,
  };

  return {
    [CALL_GATE]: {
      method: 'content.getSubscriptions',
      types: [FETCH_FOLLOWING, FETCH_FOLLOWING_SUCCESS, FETCH_FOLLOWING_ERROR],
      params,
    },
    meta: params,
  };
};

export const getSubscribers = ({ userId, sequenceKey } = {}) => {
  const params = {
    userId,
    limit: 20,
    sequenceKey,
  };

  return {
    [CALL_GATE]: {
      method: 'content.getSubscribers',
      types: [FETCH_FOLLOWERS, FETCH_FOLLOWERS_SUCCESS, FETCH_FOLLOWERS_ERROR],
      params,
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};
