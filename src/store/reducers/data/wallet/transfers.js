import u from 'updeep';

import {
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
} from 'store/constants';

export default function(state = {}, { type, payload, meta }) {
  switch (type) {
    case FETCH_TRANSFERS_HISTORY: {
      const currency = meta.currencies.join('/');

      if (meta.sequenceKey) {
        return u.updateIn([currency, meta.direction], { isLoading: true }, state);
      }

      return u.updateIn(
        [currency, meta.direction],
        {
          isLoading: true,
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );
    }

    case FETCH_TRANSFERS_HISTORY_SUCCESS: {
      const currency = meta.currencies.join('/');

      return u.updateIn(
        [currency, meta.direction],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );
    }

    case FETCH_TRANSFERS_HISTORY_ERROR: {
      const currency = meta.currencies.join('/');

      return u.updateIn([currency, meta.direction], { isLoading: false }, state);
    }

    default:
      return state;
  }
}
