import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

import {
  WITHDRAW_STAKE,
  WITHDRAW_STAKE_SUCCESS,
  WITHDRAW_STAKE_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'cyberStake';

// eslint-disable-next-line import/prefer-default-export
export const withdrawStake = tokensQuantity => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    account: userId,
    quantity: `${tokensQuantity} CYBER`,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [WITHDRAW_STAKE, WITHDRAW_STAKE_SUCCESS, WITHDRAW_STAKE_ERROR],
      contract: CONTRACT_NAME,
      method: 'withdraw',
      params: data,
    },
    meta: data,
  });
};
