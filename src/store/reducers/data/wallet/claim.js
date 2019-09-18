import {
  FETCH_CLAIM_HISTORY,
  FETCH_CLAIM_HISTORY_SUCCESS,
  FETCH_CLAIM_HISTORY_ERROR,
} from 'store/constants';

export default function(state, { type, payload, meta }) {
  switch (type) {
    case FETCH_CLAIM_HISTORY:
      if (meta.sequenceKey) {
        return { ...state, isLoading: true };
      }

      return {
        isLoading: true,
        claims: [],
        sequenceKey: null,
        isHistoryEnd: false,
      };

    case FETCH_CLAIM_HISTORY_SUCCESS:
      return {
        isLoading: false,
        claims: [...state?.claims, ...payload.claims],
        sequenceKey: payload.sequenceKey || null,
        isHistoryEnd: payload.claims.length < meta.limit,
      };

    case FETCH_CLAIM_HISTORY_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
