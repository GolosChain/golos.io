import {
  FETCH_VESTING_PARAMS,
  FETCH_VESTING_PARAMS_SUCCESS,
  FETCH_VESTING_PARAMS_ERROR,
} from 'store/constants';

const initialState = {
  vesting: {
    // TODO
    minAmount: 5000000,
    maxInterest: 0,
  },
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_VESTING_PARAMS:
      return { ...state, vesting: payload };
    case FETCH_VESTING_PARAMS_SUCCESS:
      return { ...state, vesting: payload };
    case FETCH_VESTING_PARAMS_ERROR:
      return { ...state, vesting: payload };

    default:
      return state;
  }
}
