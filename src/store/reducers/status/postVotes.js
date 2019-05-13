import {
  FETCH_POST_VOTES,
  FETCH_POST_VOTES_SUCCESS,
  FETCH_POST_VOTES_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  isLoading: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case FETCH_POST_VOTES:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_POST_VOTES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case FETCH_POST_VOTES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
