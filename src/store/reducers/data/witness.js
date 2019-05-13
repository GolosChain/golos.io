import { FETCH_LEADERS, FETCH_LEADERS_SUCCESS, FETCH_LEADERS_ERROR } from 'store/constants';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  isEnd: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_LEADERS:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case FETCH_LEADERS_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const items = meta.sequenceKey ? state.items.concat(payload.items) : payload.items;

      return {
        ...state,
        items,
        isEnd: payload.items.length < meta.limit,
        isLoading: false,
        isError: false,
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
