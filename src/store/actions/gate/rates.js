/* eslint-disable import/prefer-default-export */
import {
  FETCH_ACTUAL_RATES,
  FETCH_ACTUAL_RATES_SUCCESS,
  FETCH_ACTUAL_RATES_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const getActualRates = () => ({
  [CALL_GATE]: {
    types: [FETCH_ACTUAL_RATES, FETCH_ACTUAL_RATES_SUCCESS, FETCH_ACTUAL_RATES_ERROR],
    method: 'rates.getActual',
    params: {},
  },
});
