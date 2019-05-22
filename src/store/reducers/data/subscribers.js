import {
  FETCH_SUBSCRIBERS,
  FETCH_SUBSCRIBERS_SUCCESS,
  FETCH_SUBSCRIBERS_ERROR,
} from 'store/constants';

const initialState = {
  items: [],
  isEnd: false,
  isLoading: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_SUBSCRIBERS:
      if (meta.sequenceKey) {
        return {
          ...state,
          isLoading: true,
        };
      } else {
        return {
          ...initialState,
          isLoading: true,
        };
      }

    case FETCH_SUBSCRIBERS_SUCCESS:
      return {
        ...state,
        items: state.items.concat(payload.items),
        sequenceKey: payload.sequenceKey,
        isLoading: false,
        isEnd: payload.items.length < meta.limit,
      };

    case FETCH_SUBSCRIBERS_ERROR:
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
}
