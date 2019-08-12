import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_REWARDS_HISTORY,
  FETCH_REWARDS_HISTORY_SUCCESS,
  FETCH_REWARDS_HISTORY_ERROR,
  FETCH_VESTING_HISTORY,
  FETCH_VESTING_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY_ERROR,
  FETCH_GENESIS_CONVERSIONS,
  FETCH_GENESIS_CONVERSIONS_SUCCESS,
  FETCH_GENESIS_CONVERSIONS_ERROR,
  FETCH_VESTING_PARAMS,
  FETCH_VESTING_PARAMS_SUCCESS,
  FETCH_VESTING_PARAMS_ERROR,
  CONVERT_VESTING_TO_TOKEN,
  CONVERT_VESTING_TO_TOKEN_SUCCESS,
  CONVERT_VESTING_TO_TOKEN_ERROR,
  CONVERT_TOKENS_TO_VESTING,
  CONVERT_TOKENS_TO_VESTING_SUCCESS,
  CONVERT_TOKENS_TO_VESTING_ERROR,
  FETCH_VESTING_SUPPLY_AND_BALANCE,
  FETCH_VESTING_SUPPLY_AND_BALANCE_SUCCESS,
  FETCH_VESTING_SUPPLY_AND_BALANCE_ERROR,
} from 'store/constants';
import { GOLOS_CURRENCY_ID } from 'shared/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const getBalance = userId => {
  if (!userId) {
    throw new Error('Username is required!');
  }

  const params = {
    userId,
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

export const getTransfersHistory = ({
  userId,
  currencies = ['all'],
  direction = 'all',
  sequenceKey = null,
} = {}) => {
  if (!userId) {
    throw new Error('userId is required!');
  }

  const params = {
    userId,
    currencies: [...currencies].sort(),
    direction,
    sequenceKey,
    limit: 20,
  };

  return {
    [CALL_GATE]: {
      types: [
        FETCH_TRANSFERS_HISTORY,
        FETCH_TRANSFERS_HISTORY_SUCCESS,
        FETCH_TRANSFERS_HISTORY_ERROR,
      ],
      method: 'wallet.getTransferHistory',
      params,
    },
    meta: params,
  };
};

export const getRewardsHistory = ({ userId, types = ['all'], sequenceKey = null } = {}) => {
  if (!userId) {
    throw new Error('userId is required!');
  }

  const params = {
    userId,
    types: [...types].sort(),
    sequenceKey,
    limit: 20,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_REWARDS_HISTORY, FETCH_REWARDS_HISTORY_SUCCESS, FETCH_REWARDS_HISTORY_ERROR],
      method: 'wallet.getRewardsHistory',
      params,
    },
    meta: params,
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

export const getVestingHistory = ({ userId, sequenceKey = null }) => {
  if (!userId) {
    throw new Error('userId is required!');
  }

  const params = {
    userId,
    limit: 20,
    sequenceKey,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_VESTING_HISTORY, FETCH_VESTING_HISTORY_SUCCESS, FETCH_VESTING_HISTORY_ERROR],
      method: 'wallet.getVestingHistory',
      params,
    },
    meta: params,
  };
};

export const getGenesisConversions = ({ userId }) => {
  if (!userId) {
    throw new Error('userId is required!');
  }

  const params = {
    userId,
  };

  return {
    [CALL_GATE]: {
      types: [
        FETCH_GENESIS_CONVERSIONS,
        FETCH_GENESIS_CONVERSIONS_SUCCESS,
        FETCH_GENESIS_CONVERSIONS_ERROR,
      ],
      method: 'wallet.getGenesisConv',
      params,
    },
    meta: params,
  };
};

// TODO
export const getVestingParams = () => {
  const params = {};

  return {
    [CALL_GATE]: {
      types: [FETCH_VESTING_PARAMS, FETCH_VESTING_PARAMS_SUCCESS, FETCH_VESTING_PARAMS_ERROR],
      method: 'wallet.getVestingParams',
      params,
    },
    meta: {},
  };
};

export const convertVestingToToken = vesting => {
  const params = { vesting: `${vesting} ${GOLOS_CURRENCY_ID}` };

  return {
    [CALL_GATE]: {
      types: [
        CONVERT_VESTING_TO_TOKEN,
        CONVERT_VESTING_TO_TOKEN_SUCCESS,
        CONVERT_VESTING_TO_TOKEN_ERROR,
      ],
      method: 'wallet.convertVestingToToken',
      params,
    },
    meta: params,
  };
};

export const convertTokensToVesting = tokens => {
  const params = { tokens: `${tokens} ${GOLOS_CURRENCY_ID}` };

  return {
    [CALL_GATE]: {
      types: [
        CONVERT_TOKENS_TO_VESTING,
        CONVERT_TOKENS_TO_VESTING_SUCCESS,
        CONVERT_TOKENS_TO_VESTING_ERROR,
      ],
      method: 'wallet.convertTokensToVesting',
      params,
    },
    meta: params,
  };
};

export const getVestingSupplyAndBalance = () => {
  return {
    [CALL_GATE]: {
      types: [
        FETCH_VESTING_SUPPLY_AND_BALANCE,
        FETCH_VESTING_SUPPLY_AND_BALANCE_SUCCESS,
        FETCH_VESTING_SUPPLY_AND_BALANCE_ERROR,
      ],
      method: 'wallet.getVestingSupplyAndBalance',
    },
  };
};
