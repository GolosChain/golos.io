/* eslint-disable import/prefer-default-export */

import { CALL_GATE } from 'store/middlewares/gate-api';
import { FETCH_LEADERS, FETCH_LEADERS_SUCCESS, FETCH_LEADERS_ERROR } from 'store/constants';

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
      waitAutoLogin: true,
    },
  };
};
