import {
  FETCH_GENESIS_CONVERSIONS,
  FETCH_GENESIS_CONVERSIONS_SUCCESS,
  FETCH_GENESIS_CONVERSIONS_ERROR,
} from 'store/constants';

export default function(state, { type, payload }) {
  switch (type) {
    case FETCH_GENESIS_CONVERSIONS:
      return {
        ...state,
        isLoading: true,
        items: [],
      };

    case FETCH_GENESIS_CONVERSIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
      };

    case FETCH_GENESIS_CONVERSIONS_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
