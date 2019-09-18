import u from 'updeep';

import { FETCH_VESTING_SUPPLY_AND_BALANCE_SUCCESS } from 'store/constants';

import balances from './balances';
import transfers from './transfers';
import vestings from './vestings';
import rewards from './rewards';
import genesis from './genesis';
import claim from './claim';
import receivedDelegations from './receivedDelegations';

const userReducers = {
  receivedDelegations,
  balances,
  transfers,
  vestings,
  genesis,
  claim,
  rewards,
};

const initialState = {
  globalSupply: {
    golos: {
      balance: 0,
      supply: 0,
    },
  },
  users: {},
};

const innerReducersList = Array.from(Object.keys(userReducers));

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
    const { userId } = meta;

    const user = { ...(state.users[userId] || {}) };
    let userUpdated = false;

    for (const reducerField of innerReducersList) {
      const userField = user[reducerField];
      user[reducerField] = userReducers[reducerField](userField, action);

      if (user[reducerField] !== userField) {
        userUpdated = true;
      }
    }

    if (!userUpdated) {
      return state;
    }

    return u.updateIn(['users', userId], user, state);
  }

  return state;
}
