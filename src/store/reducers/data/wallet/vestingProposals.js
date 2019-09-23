import { FETCH_VESTING_PROPOSALS_SUCCESS, ACCEPT_VESTING_PROPOSAL_SUCCESS } from 'store/constants';

const initialState = {
  items: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_VESTING_PROPOSALS_SUCCESS:
      return {
        items: payload.items,
      };

    case ACCEPT_VESTING_PROPOSAL_SUCCESS:
      if (!state.items) {
        return state;
      }

      return {
        items: state.items.filter(({ proposalId }) => meta.proposalId !== proposalId),
      };

    default:
      return state;
  }
}
