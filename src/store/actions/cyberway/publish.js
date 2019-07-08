import {
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  UPDATE_POST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  VOTE_POST,
  VOTE_POST_SUCCESS,
  VOTE_POST_ERROR,
  REBLOG_POST,
  REBLOG_POST_SUCCESS,
  REBLOG_POST_ERROR,
  REMOVE_REBLOG_POST,
  REMOVE_REBLOG_POST_SUCCESS,
  REMOVE_REBLOG_POST_ERROR,
} from 'store/constants/actionTypes';
import { CYBERWAY_API } from 'store/middlewares/cyberway-api';
import { currentUserIdSelector } from 'store/selectors/auth';

import { defaults } from 'utils/common';

export const createmssg = data => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const fullData = defaults(data, {
    message_id: {
      author: '',
      permlink: '',
    },
    parent_id: {
      author: '',
      permlink: '',
    },
    parent_recid: 0,
    beneficiaries: [],
    curators_prcnt: 2500,
    max_payout: null,
    tokenprop: 5000,
    vestpayment: true,
    headermssg: '',
    bodymssg: '',
    languagemssg: '',
    tags: [],
    jsonmetadata: '',
  });

  fullData.message_id.author = userId;

  return dispatch({
    [CYBERWAY_API]: {
      types: [CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_ERROR],
      contract: 'publish',
      method: 'createMessage',
      params: fullData,
    },
    meta: fullData,
  });
};

export const updatemssg = data => async dispatch => {
  const fullData = defaults(data, {
    message_id: {
      author: '',
      permlink: '',
    },
    headermssg: '',
    bodymssg: '',
    languagemssg: '',
    tags: [],
    jsonmetadata: '',
  });

  return dispatch({
    [CYBERWAY_API]: {
      types: [UPDATE_POST, UPDATE_POST_SUCCESS, UPDATE_POST_ERROR],
      contract: 'publish',
      method: 'updatemssg',
      params: fullData,
    },
    meta: fullData,
  });
};

export const deletemssg = data => async dispatch => {
  const fullData = defaults(data, {
    message_id: {
      author: '',
      permlink: '',
    },
  });

  return dispatch({
    [CYBERWAY_API]: {
      types: [DELETE_POST, DELETE_POST_SUCCESS, DELETE_POST_ERROR],
      contract: 'publish',
      method: 'deletemssg',
      params: fullData,
    },
    meta: fullData,
  });
};

export const vote = data => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const fullData = defaults(data, {
    voter: '',
    message_id: null,
    weight: 0,
  });

  fullData.voter = userId;

  const { weight } = fullData;
  let methodName;

  if (weight === 0) {
    methodName = 'unvote';
    delete fullData.weight;
  } else if (weight < 0) {
    methodName = 'downvote';
    fullData.weight = Math.abs(weight);
  } else {
    methodName = 'upvote';
  }

  return dispatch({
    [CYBERWAY_API]: {
      types: [VOTE_POST, VOTE_POST_SUCCESS, VOTE_POST_ERROR],
      contract: 'publish',
      method: methodName,
      params: fullData,
    },
    meta: fullData,
  });
};

export const reblog = ({ contentId, text }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const params = {
    rebloger: userId,
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    headermssg: '',
    bodymssg: text,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [REBLOG_POST, REBLOG_POST_SUCCESS, REBLOG_POST_ERROR],
      contract: 'publish',
      method: 'reblog',
      params,
    },
    meta: params,
  });
};

export const removeReblog = post => (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const params = {
    rebloger: userId,
    message_id: {
      author: post.contentId.userId,
      permlink: post.contentId.permlink,
    },
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [REMOVE_REBLOG_POST, REMOVE_REBLOG_POST_SUCCESS, REMOVE_REBLOG_POST_ERROR],
      contract: 'publish',
      method: 'erasereblog',
      params,
    },
    meta: {
      userId,
      post,
    },
  });
};
