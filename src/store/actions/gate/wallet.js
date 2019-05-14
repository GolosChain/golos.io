import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_VESTING_HISTORY,
  FETCH_VESTING_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY_ERROR,
} from 'store/constants';
import { TRANSFERS_FILTER_TYPE } from 'shared/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

// eslint-disable-next-line
export const getBalance = userId => {
  if (!userId) {
    throw new Error('Username is required!');
  }

  const params = {
    name: userId,
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

export const getVestingHistory = (userId, from = -1) => {
  if (!userId) {
    throw new Error('Username is required!');
  }

  const params = {
    account: userId,
    limit: 20,
    from,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_VESTING_HISTORY, FETCH_VESTING_HISTORY_SUCCESS, FETCH_VESTING_HISTORY_ERROR],
      method: 'wallet.getVestingHistory',
      params,
    },
    meta: {
      ...params,
      name: userId,
    },
  };
};
