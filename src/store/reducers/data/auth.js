import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT_SUCCESS,
  SET_SERVER_ACCOUNT_NAME,
} from 'store/constants/actionTypes';

const initialState = {
  isAutoLogging: false,
  currentUser: null,
  error: null,
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
    case SET_SERVER_ACCOUNT_NAME:
      return {
        ...state,
        isAutoLogging: true,
      };
    default:
      return state;
  }
}
