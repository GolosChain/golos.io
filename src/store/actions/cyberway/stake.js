import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'cyberStake';

export const delegateVote = (recipientName, quantity) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return dispatch({
    [CYBERWAY_API]: {
      contract: CONTRACT_NAME,
      method: 'delegatevote',
      params: {
        grantor_name: userId,
        recipient_name: recipientName,
        quantity,
      },
    },
  });
};

export const withdraw = (recipientName, quantity) => ({
  [CYBERWAY_API]: {
    contract: CONTRACT_NAME,
    method: 'withdraw',
    params: {
      account: recipientName,
      quantity,
    },
  },
});

export const recallvote = (recipientName, sym, percent) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return dispatch({
    [CYBERWAY_API]: {
      contract: CONTRACT_NAME,
      method: 'recallvote',
      params: {
        grantor_name: userId,
        recipient_name: recipientName,
        token_code: sym,
        pct: percent * 100,
      },
    },
  });
};
