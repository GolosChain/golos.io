import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  FETCH_VESTING_PROPOSALS,
  FETCH_VESTING_PROPOSALS_SUCCESS,
  FETCH_VESTING_PROPOSALS_ERROR,
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
      params: {
        contract: 'gls.vesting',
        method: 'delegate',
      },
    },
    meta: {
      userId,
    },
  });
};
