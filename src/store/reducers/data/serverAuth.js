import {
  SET_SERVER_ACCOUNT,
  GATE_AUTHORIZE_SUCCESS,
  GATE_AUTHORIZE_ERROR,
  AUTH_LOGOUT_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  userId: null,
  username: null,
  unsafe: true,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_SERVER_ACCOUNT:
      return {
        ...initialState,
        userId: payload.userId,
        username: payload.username,
      };

    case GATE_AUTHORIZE_SUCCESS:
    case GATE_AUTHORIZE_ERROR:
    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
