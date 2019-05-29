import { FETCH_ACTUAL_RATES_SUCCESS } from 'store/constants';

const initialState = {
  USD: null,
  EUR: null,
  RUB: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ACTUAL_RATES_SUCCESS:
      return {
        ...state,
        USD: payload?.rates?.GOLOS.USD,
        EUR: payload?.rates?.GOLOS.EUR,
        RUB: payload?.rates?.GOLOS.RUB,
      };

    default:
      return state;
  }
}
