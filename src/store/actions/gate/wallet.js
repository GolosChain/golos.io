import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_USER_VESTING_BALANCE,
  FETCH_USER_VESTING_BALANCE_SUCCESS,
  FETCH_USER_VESTING_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
} from 'store/constants';
import { TRANSFERS_FILTER_TYPE } from 'shared/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const getBalance = userId => {
  if (!userId) {
    throw new Error('Username is required!');
  }

  const params = {
    name: userId,
    tokensList: ['GOLOS'],
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_USER_BALANCE, FETCH_USER_BALANCE_SUCCESS, FETCH_USER_BALANCE_ERROR],
      method: 'wallet.getBalance',
      params,
    },
    meta: params,
  };
};

export const getVestingBalance = userId => {
  if (!userId) {
    throw new Error('Username is required!');
  }

  const params = {
    account: userId,
  };

  return {
    [CALL_GATE]: {
      types: [
        FETCH_USER_VESTING_BALANCE,
        FETCH_USER_VESTING_BALANCE_SUCCESS,
        FETCH_USER_VESTING_BALANCE_ERROR,
      ],
      method: 'wallet.getVestingBalance',
      params,
    },
    meta: params,
  };
};

export const getTransfersHistory = (username, { isIncoming }) => {
  if (!username) {
    throw new Error('Username is required!');
  }

  const params = {
    query: {
      [isIncoming ? TRANSFERS_FILTER_TYPE.RECEIVER : TRANSFERS_FILTER_TYPE.SENDER]: username,
    },
  };

  return {
    [CALL_GATE]: {
      types: [
        FETCH_TRANSFERS_HISTORY,
        FETCH_TRANSFERS_HISTORY_SUCCESS,
        FETCH_TRANSFERS_HISTORY_ERROR,
      ],
      method: 'wallet.getHistory',
      params,
    },
    meta: {
      ...params,
      name: username,
    },
  };
};

export const waitForWalletTransaction = transactionId => {
  if (!transactionId) {
    throw new Error('transactionId is required!');
  }

  const params = {
    transactionId,
  };

  return {
    [CALL_GATE]: {
      //  TODO: replace with wallet.waitForTransaction in future
      method: 'content.waitForTransaction',
      params,
    },
    meta: params,
  };
};
