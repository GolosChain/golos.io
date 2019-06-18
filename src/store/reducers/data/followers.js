import {
  FETCH_FOLLOWERS,
  FETCH_FOLLOWERS_SUCCESS,
  FETCH_FOLLOWERS_ERROR,
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_SUCCESS,
} from 'store/constants';

const initialState = {
  items: [],
  isEnd: false,
  isLoading: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_FOLLOWERS:
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

    case FETCH_FOLLOWERS_SUCCESS:
      return {
        ...state,
        items: state.items.concat(payload.items),
        sequenceKey: payload.sequenceKey,
        isLoading: false,
        isEnd: payload.items.length < meta.limit,
      };

    case FETCH_FOLLOWERS_ERROR:
      return {
        ...initialState,
        isLoading: false,
      };

    case FOLLOW_USER_SUCCESS:
    case UNFOLLOW_USER_SUCCESS:
      return {
        ...state,
        items: state.items.map(item => {
          if (item.userId === meta.pinning) {
            return {
              ...item,
              isSubscribed: type === FOLLOW_USER_SUCCESS,
            };
          }

          return item;
        }),
      };

    default:
      return state;
  }
}
