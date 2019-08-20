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
  FETCH_PROPOSALS,
  FETCH_PROPOSALS_SUCCESS,
  FETCH_PROPOSALS_ERROR,
  FETCH_NOTIFY_META,
  FETCH_NOTIFY_META_SUCCESS,
  FETCH_NOTIFY_META_ERROR,
} from 'store/constants';
import { contentMetaSchema, proposalSchema } from 'store/schemas/gate';

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

export const fetchProposals = ({ sequenceKey } = {}) => {
  const params = {
    communityId: 'gls',
    limit: 20,
    sequenceKey,
  };

  return {
    [CALL_GATE]: {
      method: 'content.getProposals',
      types: [FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR],
      params,
      schema: { items: [proposalSchema] },
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

export const getNotifyMeta = ({ contentId, userId }) => {
  const params = {
    contentId,
    userId,
  };

  return {
    [CALL_GATE]: {
      method: 'content.getNotifyMeta',
      types: [FETCH_NOTIFY_META, FETCH_NOTIFY_META_SUCCESS, FETCH_NOTIFY_META_ERROR],
      params,
      schema: contentMetaSchema,
    },
    meta: params,
  };
};
