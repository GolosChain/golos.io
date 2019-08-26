import { FETCH_LEADERS, FETCH_LEADERS_SUCCESS, FETCH_LEADERS_ERROR } from 'store/constants';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  isEnd: false,
  query: null,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_LEADERS:
      if (meta.sequenceKey || meta.query) {
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      } else {
        return {
          ...initialState,
          isLoading: true,
        };
      }

    case FETCH_LEADERS_SUCCESS:
      const payloadItems = payload.items || payload.leaders;

      const items =
        meta.sequenceKey && !meta.query ? state.items.concat(payloadItems) : payloadItems;

      return {
        ...state,
        items,
        isEnd: payloadItems.length < meta.limit,
        isLoading: false,
        isError: false,
        query: meta.query || null,
        sequenceKey: payload.sequenceKey,
      };

    case FETCH_LEADERS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    default:
      return state;
  }
}
