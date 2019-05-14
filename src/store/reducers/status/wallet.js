import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_USER_VESTING_BALANCE,
  FETCH_USER_VESTING_BALANCE_SUCCESS,
  FETCH_USER_VESTING_BALANCE_ERROR,
} from 'store/constants';

const initialState = {
  isLoading: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case FETCH_USER_BALANCE:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_USER_BALANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_USER_BALANCE_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_USER_VESTING_BALANCE:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_USER_VESTING_BALANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_USER_VESTING_BALANCE_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_TRANSFERS_HISTORY:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_TRANSFERS_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_TRANSFERS_HISTORY_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
