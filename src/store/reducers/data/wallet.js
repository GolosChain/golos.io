import u from 'updeep';

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

      return u.updateIn([meta.userId, 'balances'], payload, state);

    // Transfers

    case FETCH_TRANSFERS_HISTORY:
    case FETCH_TRANSFERS_HISTORY_ERROR: {
      const currency = meta.currencies.sort().join('/');

      if (meta.sequenceKey) {
        return u.updateIn(
          [meta.name, 'transfers', currency, meta.direction],
          { isLoading: !Boolean(error) },
          state
        );
      }

      return u.updateIn(
        [meta.name, 'transfers', currency, meta.direction],
        {
          isLoading: !Boolean(error),
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );
    }

    case FETCH_TRANSFERS_HISTORY_SUCCESS: {
      const currency = meta.currencies.sort().join('/');

      return u.updateIn(
        [meta.name, 'transfers', currency, meta.direction],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );
    }

    // Vestings

    case FETCH_VESTING_HISTORY:
    case FETCH_VESTING_HISTORY_ERROR:
      if (meta.sequenceKey) {
        return u.updateIn([meta.name, 'vestings'], { isLoading: !Boolean(error) }, state);
      }

      return u.updateIn(
        [meta.name, 'vestings'],
        {
          isLoading: !Boolean(error),
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );

    case FETCH_VESTING_HISTORY_SUCCESS:
      return u.updateIn(
        [meta.name, 'vestings'],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );

    // Rewards

    case FETCH_REWARDS_HISTORY:
    case FETCH_REWARDS_HISTORY_ERROR: {
      const types = meta.types.sort().join('/');

      if (meta.sequenceKey) {
        return u.updateIn([meta.name, 'rewards', types], { isLoading: !Boolean(error) }, state);
      }

      return u.updateIn(
        [meta.name, 'rewards', types],
        {
          isLoading: !Boolean(error),
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );
    }

    case FETCH_REWARDS_HISTORY_SUCCESS: {
      const types = meta.types.sort().join('/');

      return u.updateIn(
        [meta.name, 'rewards', types],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );
    }

    default:
      return state;
  }
}
