import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

import {
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  STOP_WITHDRAW,
  STOP_WITHDRAW_SUCCESS,
  STOP_WITHDRAW_ERROR,
  DELEGATE,
  DELEGATE_SUCCESS,
  DELEGATE_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector, currentUserSelector } from 'store/selectors/auth';
import { GOLOS_CURRENCY_ID } from 'shared/constants';
import { normalizeCyberwayErrorMessage } from 'utils/errors';
import { isVestingAlreadyOpened, markVestingOpened } from 'utils/localStorage';

const CONTRACT_NAME = 'vesting';
const VESTING_SYMBOL = '6,GOLOS';

export const openVesting = () => async (dispatch, getState) => {
  const user = currentUserSelector(getState());

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { userId, permission } = user;

  if (isVestingAlreadyOpened(userId)) {
    return;
  }

  if (permission !== 'active' && permission !== 'owner') {
    throw new Error('No permission');
  }

  try {
    await dispatch({
      [CYBERWAY_API]: {
        contract: CONTRACT_NAME,
        method: 'open',
        params: {
          symbol: VESTING_SYMBOL,
          owner: userId,
          ram_payer: userId,
        },
      },
    });

    markVestingOpened(userId);
  } catch (err) {
    if (normalizeCyberwayErrorMessage(err) === 'already exists') {
      markVestingOpened(userId);
    } else {
      throw err;
    }
  }
};

export const withdrawTokens = tokensQuantity => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    from: userId,
    to: userId,
    quantity: `${tokensQuantity} ${GOLOS_CURRENCY_ID}`,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [WITHDRAW, WITHDRAW_SUCCESS, WITHDRAW_ERROR],
      contract: CONTRACT_NAME,
      method: 'withdraw',
      params: data,
    },
    meta: data,
  });
};

export const stopWithdrawTokens = () => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    owner: userId,
    symbol: VESTING_SYMBOL,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [STOP_WITHDRAW, STOP_WITHDRAW_SUCCESS, STOP_WITHDRAW_ERROR],
      contract: CONTRACT_NAME,
      method: 'stopwithdraw',
      params: data,
    },
    meta: data,
  });
};

export const undelegateTokens = (to, amount) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    from: userId,
    to,
    quantity: `${parseFloat(amount).toFixed(6)} GOLOS`,
  };

  return dispatch({
    [CYBERWAY_API]: {
      contract: CONTRACT_NAME,
      method: 'undelegate',
      params: data,
    },
    meta: data,
  });
};
