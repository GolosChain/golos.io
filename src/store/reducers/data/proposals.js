import { FETCH_PROPOSALS, FETCH_PROPOSALS_SUCCESS, FETCH_PROPOSALS_ERROR } from 'store/constants';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_PROPOSALS:
      if (meta.offset !== 0) {
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
      const { result } = payload;
      const items = meta.offset === 0 ? result.items : state.items.concat(result.items);

      return {
        ...state,
        items,
        isEnd: result.items.length < meta.limit,
        isLoading: false,
        isError: false,
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
