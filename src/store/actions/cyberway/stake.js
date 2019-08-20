import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'cyberStake';

export const delegateVote = (validator, quantity) => async (dispatch, getState) => {
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
        recipient_name: validator,
        quantity,
      },
    },
  });
};
