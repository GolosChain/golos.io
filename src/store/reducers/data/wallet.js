import update from 'immutability-helper';

import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY,
  FETCH_VESTING_HISTORY_SUCCESS,
} from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_USER_BALANCE_SUCCESS:
      // eslint-disable-next-line no-param-reassign
      delete payload.userId;

      if (state[meta.userId]) {
        return update(state, {
          [meta.userId]: {
            balances: {
              $set: payload || {},
            },
          },
        });
      }

      return {
        ...state,
        [meta.userId]: {
          balances: payload || {},
        },
      };

    case FETCH_TRANSFERS_HISTORY:
      if (!state[meta.name] || !state[meta.name].transfers) {
        return {
          ...state,
          [meta.name]: {
            transfers: {},
            ...state[meta.name],
          },
        };
      }

      return state;

    case FETCH_TRANSFERS_HISTORY_SUCCESS:
      if (
        state[meta.name] &&
        meta.sequenceKey &&
        meta.sequenceKey !== payload.sequenceKey &&
        meta.sequenceKey === state[meta.name].transfers[meta.currency][meta.direction].sequenceKey
      ) {
        return update(state, {
          [meta.name]: {
            transfers: transfers =>
              update(transfers || {}, {
                [meta.currency]: {
                  [meta.direction]: {
                    items: {
                      $push: payload.items || [],
                    },
                    sequenceKey: {
                      $set: payload.sequenceKey || null,
                    },
                    isHistoryEnd: {
                      $set: payload.items.length < meta.limit,
                    },
                  },
                },
              }),
          },
        });
      }

      return {
        ...state,
        [meta.name]: {
          ...state[meta.name],
          transfers: {
            ...state[meta.name].transfers,
            [meta.currency]: {
              [meta.direction]: {
                items: payload.items || [],
                sequenceKey: payload.sequenceKey,
                isHistoryEnd: payload.items.length < meta.limit,
              },
            },
          },
        },
      };

    case FETCH_VESTING_HISTORY:
      if (!state[meta.name] || !state[meta.name].vestings) {
        return {
          ...state,
          [meta.name]: {
            vestings: {},
            ...state[meta.name],
          },
        };
      }

      return state;

    case FETCH_VESTING_HISTORY_SUCCESS:
      // сейчас при загрузке всех трансферов для последнего элемента на стороне сервера на каждый запрос меняется sequenceKey
      if (
        state[meta.name] &&
        meta.sequenceKey &&
        meta.sequenceKey !== payload.sequenceKey &&
        meta.sequenceKey === state[meta.name].vestings.sequenceKey
      ) {
        return update(state, {
          [meta.name]: {
            vestings: transfers =>
              update(transfers || {}, {
                items: {
                  $push: payload.items || [],
                },
                sequenceKey: {
                  $set: payload.sequenceKey || null,
                },
                isHistoryEnd: {
                  $set: payload.items.length < meta.limit,
                },
              }),
          },
        });
      }

      return {
        ...state,
        [meta.name]: {
          ...state[meta.name],
          vestings: {
            ...state[meta.name].vestings,
            items: payload.items || [],
            sequenceKey: payload.sequenceKey,
            isHistoryEnd: payload.items.length < meta.limit,
          },
        },
      };

    default:
      return state;
  }
}
