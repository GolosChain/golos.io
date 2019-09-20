import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
} from 'store/constants';

export default function(state, { type, payload, meta }) {
  switch (type) {
    case FETCH_USER_BALANCE:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_USER_BALANCE_SUCCESS:
      return {
        isLoading: false,
        liquid: payload.liquid,
        stakeInfo: payload.stakeInfo,
        vesting: payload.vesting,
      };

    case FETCH_USER_BALANCE_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
