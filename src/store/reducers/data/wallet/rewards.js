import u from 'updeep';

import {
  FETCH_REWARDS_HISTORY,
  FETCH_REWARDS_HISTORY_SUCCESS,
  FETCH_REWARDS_HISTORY_ERROR,
} from 'store/constants';

export default function(state = {}, { type, payload, meta }) {
  if (!meta || !meta.types) {
    return state;
  }

  const types = meta.types.join('/');

  switch (type) {
    case FETCH_REWARDS_HISTORY: {
      if (meta.sequenceKey) {
        return u.updateIn([types], { isLoading: true }, state);
      }

      return u.updateIn(
        [types],
        {
          isLoading: true,
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );
    }

    case FETCH_REWARDS_HISTORY_SUCCESS: {
      return u.updateIn(
        [types],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );
    }

    case FETCH_REWARDS_HISTORY_ERROR: {
      return u.updateIn([types], { isLoading: false }, state);
    }

    default:
      return state;
  }
}
