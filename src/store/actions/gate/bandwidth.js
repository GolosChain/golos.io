import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  FETCH_VESTING_PROPOSALS,
  FETCH_VESTING_PROPOSALS_SUCCESS,
  FETCH_VESTING_PROPOSALS_ERROR,
  ACCEPT_VESTING_PROPOSAL,
  ACCEPT_VESTING_PROPOSAL_SUCCESS,
  ACCEPT_VESTING_PROPOSAL_ERROR,
} from 'store/constants';
import { currentUserIdSelector } from 'store/selectors/auth';

export const fetchVestingProposals = () => async (dispatch, getState) => {
  const state = getState();
  const userId = currentUserIdSelector(state);

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return dispatch({
    [CALL_GATE]: {
      types: [
        FETCH_VESTING_PROPOSALS,
        FETCH_VESTING_PROPOSALS_SUCCESS,
        FETCH_VESTING_PROPOSALS_ERROR,
      ],
      method: 'bandwidth.getProposals',
      params: {},
    },
    meta: {
      userId,
    },
  });
};

export const acceptVestingProposal = ({ proposalId }) => async (dispatch, getState) => {
  const state = getState();
  const userId = currentUserIdSelector(state);

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return dispatch({
    [CALL_GATE]: {
      types: [
        ACCEPT_VESTING_PROPOSAL,
        ACCEPT_VESTING_PROPOSAL_SUCCESS,
        ACCEPT_VESTING_PROPOSAL_ERROR,
      ],
      method: 'bandwidth.signAndExecuteProposal',
      params: {
        proposalId,
      },
    },
    meta: {
      userId,
      proposalId,
    },
  });
};
