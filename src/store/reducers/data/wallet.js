import update from 'immutability-helper';

import {
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_VESTING_HISTORY,
  FETCH_VESTING_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY_ERROR,
  FETCH_REWARDS_HISTORY,
  FETCH_REWARDS_HISTORY_SUCCESS,
  FETCH_REWARDS_HISTORY_ERROR,
} from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta, error }) {
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

    // Transfers

    case FETCH_TRANSFERS_HISTORY:
    case FETCH_TRANSFERS_HISTORY_ERROR: {
      const currency = meta.currencies.sort().join('/');

      return update(state, {
        [meta.name]: nameState =>
          update(nameState || {}, {
            transfers: transfers =>
              update(transfers || {}, {
                [currency]: currencyState =>
                  update(currencyState || {}, {
                    [meta.direction]: directionState =>
                      update(directionState || {}, {
                        $merge: {
                          isLoading: !Boolean(error),
                        },
                      }),
                  }),
              }),
          }),
      });
    }

    case FETCH_TRANSFERS_HISTORY_SUCCESS: {
      const currency = meta.currencies.sort().join('/');

      if (
        state[meta.name] &&
        meta.sequenceKey &&
        meta.sequenceKey === state[meta.name].transfers[currency][meta.direction].sequenceKey &&
        meta.sequenceKey !== payload.sequenceKey
      ) {
        return update(state, {
          [meta.name]: {
            transfers: {
              [currency]: {
                [meta.direction]: {
                  isLoading: {
                    $set: false,
                  },
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
            },
          },
        });
      }

      return {
        ...state,
        [meta.name]: {
          ...state[meta.name],
          transfers: {
            ...state[meta.name].transfers,
            [currency]: {
              [meta.direction]: {
                isLoading: false,
                items: payload.items || [],
                sequenceKey: payload.sequenceKey,
                isHistoryEnd: payload.items.length < meta.limit,
              },
            },
          },
        },
      };
    }

    // Vestings

    case FETCH_VESTING_HISTORY:
    case FETCH_VESTING_HISTORY_ERROR:
      return update(state, {
        [meta.name]: nameState =>
          update(nameState || {}, {
            vestings: vestings =>
              update(vestings || {}, {
                $merge: {
                  isLoading: !Boolean(error),
                },
              }),
          }),
      });

    case FETCH_VESTING_HISTORY_SUCCESS:
      // сейчас при загрузке всех трансферов для последнего элемента на стороне сервера на каждый запрос меняется sequenceKey
      if (
        state[meta.name] &&
        meta.sequenceKey &&
        meta.sequenceKey === state[meta.name].vestings.sequenceKey &&
        payload.sequenceKey !== meta.sequenceKey
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
            isLoading: false,
            items: payload.items || [],
            sequenceKey: payload.sequenceKey,
            isHistoryEnd: payload.items.length < meta.limit,
          },
        },
      };

    // Rewards

    case FETCH_REWARDS_HISTORY:
    case FETCH_REWARDS_HISTORY_ERROR: {
      const types = meta.types.sort().join('/');

      return update(state, {
        [meta.name]: nameState =>
          update(nameState || {}, {
            rewards: rewards =>
              update(rewards || {}, {
                [types]: typeState =>
                  update(typeState || {}, {
                    $merge: {
                      isLoading: !Boolean(error),
                    },
                  }),
              }),
          }),
      });
    }

    case FETCH_REWARDS_HISTORY_SUCCESS: {
      const types = meta.types.sort().join('/');

      if (
        state[meta.name] &&
        meta.sequenceKey &&
        meta.sequenceKey === state[meta.name].rewards[types].sequenceKey &&
        meta.sequenceKey !== payload.sequenceKey
      ) {
        return update(state, {
          [meta.name]: {
            rewards: transfers =>
              update(transfers || {}, {
                [types]: {
                  isLoading: {
                    $set: false,
                  },
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
              }),
          },
        });
      }

      return {
        ...state,
        [meta.name]: {
          ...state[meta.name],
          rewards: {
            ...state[meta.name].rewards,
            [types]: {
              isLoading: false,
              items: payload.items || [],
              sequenceKey: payload.sequenceKey,
              isHistoryEnd: payload.items.length < meta.limit,
            },
          },
        },
      };
    }

    default:
      return state;
  }
}
