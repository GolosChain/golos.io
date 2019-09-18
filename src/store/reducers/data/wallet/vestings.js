import {
  FETCH_VESTING_HISTORY,
  FETCH_VESTING_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY_ERROR,
} from 'store/constants';

const initialState = {
  isLoading: true,
  items: [],
  sequenceKey: null,
  isHistoryEnd: false,
};

export default function(state, { type, payload, meta }) {
  switch (type) {
    case FETCH_VESTING_HISTORY:
      if (meta.sequenceKey) {
        return { ...state, isLoading: true };
      }

      return initialState;

    case FETCH_VESTING_HISTORY_SUCCESS:
      return {
        isLoading: false,
        items: items => [...items, ...payload.items],
        sequenceKey: payload.sequenceKey || null,
        isHistoryEnd: payload.items.length < meta.limit,
      };

    case FETCH_VESTING_HISTORY_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
