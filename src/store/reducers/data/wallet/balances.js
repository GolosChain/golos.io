import {
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  EXEC_PROPOSAL_SUCCESS,
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
        vestingDelegationProposals: payload.vestingDelegationProposals,
      };

    case FETCH_USER_BALANCE_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case EXEC_PROPOSAL_SUCCESS:
      const { proposer, proposalId } = meta;

      if (!state?.vestingDelegationProposals?.length) {
        return state;
      }

      return {
        ...state,
        vestingDelegationProposals: state.vestingDelegationProposals.filter(
          proposal => !(proposal.proposer === proposer && proposal.proposalId === proposalId)
        ),
      };

    default:
      return state;
  }
}
