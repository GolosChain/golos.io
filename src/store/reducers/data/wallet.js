import u from 'updeep';
import { map } from 'ramda';

import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  FETCH_VESTING_HISTORY,
  FETCH_VESTING_HISTORY_SUCCESS,
  FETCH_VESTING_HISTORY_ERROR,
  FETCH_REWARDS_HISTORY,
  FETCH_REWARDS_HISTORY_SUCCESS,
  FETCH_REWARDS_HISTORY_ERROR,
  FETCH_GENESIS_CONVERSIONS,
  FETCH_GENESIS_CONVERSIONS_SUCCESS,
  FETCH_GENESIS_CONVERSIONS_ERROR,
  FETCH_VESTING_SUPPLY_AND_BALANCE_SUCCESS,
  FETCH_CLAIM_HISTORY,
  FETCH_CLAIM_HISTORY_SUCCESS,
  FETCH_CLAIM_HISTORY_ERROR,
  EXEC_PROPOSAL_SUCCESS,
} from 'store/constants';

const initialState = {
  balance: 0,
  supply: 0,
  users: {},
};

export default function(state = initialState, { type, payload, meta, error }) {
  switch (type) {
    case FETCH_USER_BALANCE:
      return u.updateIn(['users', meta.userId, 'balances'], { isLoading: true }, state);

    case FETCH_USER_BALANCE_SUCCESS:
      // eslint-disable-next-line no-param-reassign
      delete payload.userId;

      return u.updateIn(['users', meta.userId, 'balances'], payload, state);

    case FETCH_USER_BALANCE_ERROR:
      return u.updateIn(['users', meta.userId, 'balances'], { isLoading: false }, state);

    // Transfers

    case FETCH_TRANSFERS_HISTORY: {
      const currency = meta.currencies.join('/');

      if (meta.sequenceKey) {
        return u.updateIn(
          ['users', meta.userId, 'transfers', currency, meta.direction],
          { isLoading: true },
          state
        );
      }

      return u.updateIn(
        ['users', meta.userId, 'transfers', currency, meta.direction],
        {
          isLoading: true,
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );
    }

    case FETCH_TRANSFERS_HISTORY_SUCCESS: {
      const currency = meta.currencies.join('/');

      return u.updateIn(
        ['users', meta.userId, 'transfers', currency, meta.direction],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );
    }

    case FETCH_TRANSFERS_HISTORY_ERROR: {
      const currency = meta.currencies.join('/');

      return u.updateIn(
        ['users', meta.userId, 'transfers', currency, meta.direction],
        { isLoading: false },
        state
      );
    }

    // Vestings

    case FETCH_VESTING_HISTORY:
      if (meta.sequenceKey) {
        return u.updateIn(['users', meta.userId, 'vestings'], { isLoading: true }, state);
      }

      return u.updateIn(
        ['users', meta.userId, 'vestings'],
        {
          isLoading: true,
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );

    case FETCH_VESTING_HISTORY_SUCCESS:
      return u.updateIn(
        ['users', meta.userId, 'vestings'],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );

    case FETCH_VESTING_HISTORY_ERROR:
      return u.updateIn(['users', meta.userId, 'genesis'], { isLoading: false }, state);

    // Genesis
    case FETCH_GENESIS_CONVERSIONS:
      return u.updateIn(
        ['users', meta.userId, 'genesis'],
        {
          isLoading: true,
          items: [],
        },
        state
      );

    case FETCH_GENESIS_CONVERSIONS_SUCCESS:
      return u.updateIn(
        ['users', meta.userId, 'genesis'],
        {
          isLoading: false,
          items: payload,
        },
        state
      );

    case FETCH_GENESIS_CONVERSIONS_ERROR:
      return u.updateIn(['users', meta.userId, 'genesis'], { isLoading: false }, state);

    // Rewards

    case FETCH_REWARDS_HISTORY: {
      const types = meta.types.join('/');

      if (meta.sequenceKey) {
        return u.updateIn(['users', meta.userId, 'rewards', types], { isLoading: true }, state);
      }

      return u.updateIn(
        ['users', meta.userId, 'rewards', types],
        {
          isLoading: true,
          items: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );
    }

    case FETCH_REWARDS_HISTORY_SUCCESS: {
      const types = meta.types.join('/');

      return u.updateIn(
        ['users', meta.userId, 'rewards', types],
        {
          isLoading: false,
          items: items => [...items, ...payload.items],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.items.length < meta.limit,
        },
        state
      );
    }

    case FETCH_REWARDS_HISTORY_ERROR: {
      const types = meta.types.join('/');

      return u.updateIn(['users', meta.userId, 'rewards', types], { isLoading: false }, state);
    }

    case FETCH_VESTING_SUPPLY_AND_BALANCE_SUCCESS:
      return u.update(payload, state);

    // Claim
    case FETCH_CLAIM_HISTORY:
      if (meta.sequenceKey) {
        return u.updateIn(['users', meta.userId, 'claim'], { isLoading: true }, state);
      }

      return u.updateIn(
        ['users', meta.userId, 'claim'],
        {
          isLoading: true,
          claims: [],
          sequenceKey: null,
          isHistoryEnd: false,
        },
        state
      );

    case FETCH_CLAIM_HISTORY_SUCCESS:
      return u.updateIn(
        ['users', meta.userId, 'claim'],
        {
          isLoading: false,
          claims: claims => [...claims, ...payload.claims],
          sequenceKey: payload.sequenceKey || null,
          isHistoryEnd: payload.claims.length < meta.limit,
        },
        state
      );

    case FETCH_CLAIM_HISTORY_ERROR:
      return u.updateIn(['users', meta.userId, 'claim'], { isLoading: false }, state);

    case EXEC_PROPOSAL_SUCCESS:
      const { proposer, proposalId } = meta;

      return {
        ...state,
        users: map(user => {
          if (!user?.balances?.vestingDelegationProposals?.length) {
            return user;
          }

          return u.updateIn(
            ['balances', 'vestingDelegationProposals'],
            list =>
              list.filter(
                proposal => !(proposal.proposer === proposer && proposal.proposalId === proposalId)
              ),
            user
          );
        }, state.users),
      };

    default:
      return state;
  }
}
