import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT_SUCCESS,
  SET_SERVER_ACCOUNT,
  FETCH_CHARGERS,
  FETCH_CHARGERS_ERROR,
  FETCH_CHARGERS_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  isAutoLogging: false,
  currentUser: null,
  error: null,
  chargers: null,
};

export default function(state = initialState, { type, payload, meta, error }) {
  switch (type) {
    case AUTH_LOGIN: {
      if (meta && meta.isAutoLogging) {
        return {
          ...state,
          isAutoLogging: true,
        };
      }
      return state;
    }
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        isAutoLogging: false,
        currentUser: {
          userId: payload.userId,
          username: payload.username,
          permission: payload.permission,
        },
      };
    case AUTH_LOGIN_ERROR:
      return {
        ...state,
        isAutoLogging: false,
        error,
      };

    case AUTH_LOGOUT_SUCCESS:
      return {
        ...state,
        isAutoLogging: false,
        currentUser: null,
      };

    case SET_SERVER_ACCOUNT:
      return {
        ...state,
        isAutoLogging: true,
      };

    case FETCH_CHARGERS:
      return {
        ...state,
        chargers: null,
      };
    case FETCH_CHARGERS_SUCCESS:
      return {
        ...state,
        chargers: payload,
      };
    case FETCH_CHARGERS_ERROR:
      return {
        ...state,
        chargers: null,
      };

    default:
      return state;
  }
}
