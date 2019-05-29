import update from 'immutability-helper';
import { unionWith, eqBy, prop } from 'ramda';

import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_VESTING_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY_ERROR,
  FETCH_USER_VESTING_BALANCE_SUCCESS,
  FETCH_USER_VESTING_BALANCE_ERROR,
} from 'store/constants';

import { TRANSFERS_TYPE } from 'shared/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USER_BALANCE_SUCCESS:
      if (state[payload.name || meta.name]) {
        return update(state, {
          [payload.name || meta.name]: {
            balances: {
              $set: payload.balances || [],
            },
          },
        });
      }

      return {
        ...state,
        [payload.name || meta.name]: {
          balances: payload.balances || [],
        },
      };

    case FETCH_USER_BALANCE_ERROR:
      return {
        ...state,
      };

    case FETCH_USER_VESTING_BALANCE_SUCCESS:
      if (state[payload.account || meta.name]) {
        return update(state, {
          [payload.name || meta.name]: {
            vesting: {
              $set: {
                amount: payload.vesting,
                delegated: payload.delegated,
                received: payload.received,
              },
            },
          },
        });
      }
      return {
        ...state,
        [payload.account || meta.name]: {
          vesting: {
            amount: payload.vesting,
            delegated: payload.delegated,
            received: payload.received,
          },
        },
      };

    case FETCH_USER_VESTING_BALANCE_ERROR:
      return {
        ...state,
      };

    case FETCH_TRANSFERS_HISTORY_SUCCESS:
      if (state[payload.name || meta.name]) {
        return update(state, {
          [payload.name || meta.name]: {
            transfers: transfers =>
              update(transfers || {}, {
                [meta.query.receiver ? TRANSFERS_TYPE.RECEIVED : TRANSFERS_TYPE.SENT]: {
                  $set: payload.transfers || [],
                },
              }),
          },
        });
      }
      return {
        ...state,
        [meta.name]: {
          transfers: {
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
      if (state[meta.name] && meta.sequenceKey && payload.sequenceKey !== meta.sequenceKey) {
        return update(state, {
          [meta.name]: {
            vestingHistory: {
              $push: payload.items,
            },
            vestingSequenceKey: {
              $set: payload?.sequenceKey || null,
            },
            vestingHistorySize: {
              $set: payload?.itemsSize || 0,
            },
          },
        });
      }
      return {
        ...state,
        [meta.name]: {
          vestingHistory: payload?.items || [],
          vestingSequenceKey: payload?.sequenceKey || null,
          vestingHistorySize: payload?.itemsSize || 0,
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
