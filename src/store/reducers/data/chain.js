import { FETCH_ACCOUNT_SUCCESS } from 'store/constants/actionTypes';

const initialState = {
  account: {},
  error: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ACCOUNT_SUCCESS:
      return {
        ...state,
        account: payload,
      };
    default:
      return state;
  }
}
