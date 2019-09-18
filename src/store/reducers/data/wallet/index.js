import u from 'updeep';

import { FETCH_VESTING_SUPPLY_AND_BALANCE_SUCCESS } from 'store/constants';
import { combinePathReducers } from 'store/utils/reducers';

import balances from './balances';
import transfers from './transfers';
import vestings from './vestings';
import rewards from './rewards';
import genesis from './genesis';
import claim from './claim';
import receivedDelegations from './receivedDelegations';

const userReducers = combinePathReducers({
  receivedDelegations,
  balances,
  transfers,
  vestings,
  genesis,
  claim,
  rewards,
});

const initialState = {
  globalSupply: {
    golos: {
      balance: 0,
      supply: 0,
    },
  },
  users: {},
};

export default function(state = initialState, action) {
  const { type, payload, meta } = action;

  switch (type) {
    case FETCH_VESTING_SUPPLY_AND_BALANCE_SUCCESS:
      return u.updateIn(
        ['globalSupply', 'golos'],
        {
          balance: payload.balance,
          supply: payload.supply,
        },
        state
      );
    default:
  }

  if (meta && meta.userId) {
    return userReducers(state, ['users', meta.userId], action);
  }

  return state;
}
