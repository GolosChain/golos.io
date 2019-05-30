import { FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR } from 'store/constants';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  isEnd: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_PROPOSALS:
      if (meta.sequenceKey) {
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

    case FETCH_PROPOSALS_SUCCESS:
      const items = meta.sequenceKey ? state.items.concat(payload.items) : payload.items;

      return {
        ...state,
        items,
        isEnd: payload.items.length < meta.limit,
        isLoading: false,
        isError: false,
        sequenceKey: payload.sequenceKey,
      };

    case FETCH_PROPOSALS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    default:
      return state;
  }
}
