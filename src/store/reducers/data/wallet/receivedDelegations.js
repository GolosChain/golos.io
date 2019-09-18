import {
  FETCH_DELEGATION_STATE,
  FETCH_DELEGATION_STATE_SUCCESS,
  FETCH_DELEGATION_STATE_ERROR,
} from 'store/constants';

const initialState = {
  isLoading: false,
  error: null,
  items: [],
};

export default function(state = initialState, { type, payload, meta, error }) {
  if (!meta || !meta.direction || meta.direction !== 'in') {
    return state;
  }

  switch (type) {
    case FETCH_DELEGATION_STATE:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_DELEGATION_STATE_SUCCESS:
      return {
        isLoading: false,
        error: null,
        items: payload,
      };

    case FETCH_DELEGATION_STATE_ERROR:
      return {
        ...initialState,
        isLoading: false,
        error,
      };

    default:
      return state;
  }
}
