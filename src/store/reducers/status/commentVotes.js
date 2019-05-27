import {
  FETCH_COMMENT_VOTES,
  FETCH_COMMENT_VOTES_SUCCESS,
  FETCH_COMMENT_VOTES_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  isEnd: false,
  isLoading: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_COMMENT_VOTES:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_COMMENT_VOTES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        sequenceKey: payload.sequenceKey,
        isEnd: payload?.items?.length < meta.limit,
      };
    }

    case FETCH_COMMENT_VOTES_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
