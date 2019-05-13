import {
  FETCH_FAVORITES,
  FETCH_FAVORITES_SUCCESS,
  FETCH_FAVORITES_ERROR,
  AUTH_LOGOUT,
} from 'store/constants';

const initialState = {
  postsList: [],
  isLoading: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_FAVORITES:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_FAVORITES_SUCCESS:
      return {
        ...state,
        postsList: payload.list ? [...payload.list.reverse()] : state.postsList,
        isLoading: false,
      };
    case FETCH_FAVORITES_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case AUTH_LOGOUT:
      return initialState;
    default:
      return state;
  }
}
