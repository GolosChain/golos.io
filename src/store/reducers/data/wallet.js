import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_VESTING_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY_ERROR,
} from 'store/constants';

import { TRANSFERS_TYPE } from 'shared/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USER_BALANCE_SUCCESS:
      return {
        ...state,
        [payload.name || meta.name]: {
          ...state[payload.name || payload.name || meta.name],
          balances: payload.balances || [],
        },
      };
    case FETCH_USER_BALANCE_ERROR:
      return {
        ...state,
      };
    case FETCH_TRANSFERS_HISTORY_SUCCESS:
      return {
        ...state,
        [meta.name]: {
          ...state[meta.name],
          transfers: {
            ...(state[meta.name] ? state[meta.name].transfers : []),
            [meta.query.receiver ? TRANSFERS_TYPE.RECEIVED : TRANSFERS_TYPE.SENT]:
              payload.transfers || [],
          },
        },
      };
    case FETCH_TRANSFERS_HISTORY_ERROR:
      return {
        ...state,
      };
    case FETCH_VESTING_HISTORY_SUCCESS:
      return {
        ...state,
        [meta.name]: {
          ...state[meta.name],
          vestingHistory: {
            ...state[meta.name].vestingHistory,
            ...payload.result,
          },
        },
      };
    case FETCH_VESTING_HISTORY_ERROR:
      return {
        ...state,
      };

    default:
      return state;
  }
}
