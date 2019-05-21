import {
  FETCH_SUBSCRIPTIONS,
  FETCH_SUBSCRIPTIONS_SUCCESS,
  FETCH_SUBSCRIPTIONS_ERROR,
} from 'store/constants';

const initialState = {
  items: [],
  isEnd: false,
  isLoading: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_SUBSCRIPTIONS:
      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_SUBSCRIPTIONS_SUCCESS:
      return {
        ...state,
        items: state.items.concat(payload.items),
        sequenceKey: payload.sequenceKey,
        isLoading: false,
        isEnd: payload.items.length < meta.limit,
      };

    case FETCH_SUBSCRIPTIONS_ERROR:
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
}
