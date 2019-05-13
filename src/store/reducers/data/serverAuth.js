import {
  SET_SERVER_ACCOUNT_NAME,
  GATE_AUTHORIZE_SUCCESS,
  GATE_AUTHORIZE_ERROR,
  AUTH_LOGOUT_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  userId: null,
  unsafe: true,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_SERVER_ACCOUNT_NAME:
      return {
        ...initialState,
        userId: payload.userId,
      };

    case GATE_AUTHORIZE_SUCCESS:
    case GATE_AUTHORIZE_ERROR:
    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
