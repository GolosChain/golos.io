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
  STOP_DELEGATE,
  STOP_DELEGATE_SUCCESS,
  STOP_DELEGATE_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';
import { GOLOS_CURRENCY_ID } from 'shared/constants';

const CONTRACT_NAME = 'vesting';
const VESTING_SYMBOL = '6,GOLOS';

export const openVesting = () => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return dispatch({
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

export const delegateTokens = (recipient, tokensQuantity, percents, strategy) => async (
  dispatch,
  getState
) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  let interestRate = 0;
  let payoutStrategy = 0;

  if (percents) {
    interestRate = percents * 100;
    payoutStrategy = strategy;
  }

  const data = {
    from: userId,
    to: recipient,
    quantity: `${parseFloat(tokensQuantity).toFixed(6)} GOLOS`,
    interest_rate: interestRate,
    payout_strategy: payoutStrategy,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [DELEGATE, DELEGATE_SUCCESS, DELEGATE_ERROR],
      contract: CONTRACT_NAME,
      method: 'delegate',
      params: data,
    },
    meta: data,
  });
};

export const stopDelegateTokens = (recipient, tokensQuantity) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    from: userId,
    to: recipient,
    quantity: `${tokensQuantity} GOLOS`,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [STOP_DELEGATE, STOP_DELEGATE_SUCCESS, STOP_DELEGATE_ERROR],
      contract: CONTRACT_NAME,
      method: 'undelegate',
      params: data,
    },
    meta: data,
  });
};
