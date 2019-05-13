import {
  FETCH_PAGE_POST,
  FETCH_PAGE_POST_SUCCESS,
  FETCH_PAGE_POST_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  error: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_PAGE_POST_SUCCESS:
      return {
        ...state,
        error: null,
      };

    case FETCH_PAGE_POST_ERROR:
      return {
        ...state,
        error: payload,
      };

    default:
      return state;
  }
}
