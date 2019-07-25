import {
  FETCH_PROPOSALS,
  FETCH_PROPOSALS_SUCCESS,
  FETCH_PROPOSALS_ERROR,
  APPROVE_PROPOSAL_SUCCESS,
  EXEC_PROPOSAL_SUCCESS,
} from 'store/constants';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  isEnd: false,
  sequenceKey: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_PROPOSALS:
      if (meta.sequenceKey) {
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      } else {
        return {
          ...initialState,
          isLoading: true,
        };
      }

    case FETCH_PROPOSALS_SUCCESS:
      const items = meta.sequenceKey ? state.items.concat(payload.items) : payload.items;

      return {
        ...state,
        items,
        isEnd: payload.items.length < meta.limit,
        isLoading: false,
        isError: false,
        sequenceKey: payload.sequenceKey,
      };

    case FETCH_PROPOSALS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case APPROVE_PROPOSAL_SUCCESS:
      return {
        ...state,
        items: state.items.map(proposal => {
          if (proposal.author.userId === meta.proposer && proposal.proposalId === meta.proposalId) {
            return {
              ...proposal,
              approves: proposal.approves.map(approve => {
                if (approve.userId === meta.userId) {
                  return {
                    ...approve,
                    isSigned: true,
                  };
                }

                return approve;
              }),
            };
          }

          return proposal;
        }),
      };

    case EXEC_PROPOSAL_SUCCESS:
      return {
        ...state,
        items: state.items.map(proposal => {
          if (proposal.author.userId === meta.proposer && proposal.proposalId === meta.proposalId) {
            return {
              ...proposal,
              isExecuted: true,
            };
          }

          return proposal;
        }),
      };

    default:
      return state;
  }
}
