import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

import { VOTE_WITNESS, UNVOTE_WITNESS } from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'ctrl';

const voteWitnessAction = (methodName, actionName) => witness => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    voter: userId,
    witness,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: CONTRACT_NAME,
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const voteWitness = voteWitnessAction('votewitness', VOTE_WITNESS);
export const unvoteWitness = voteWitnessAction('unvotewitn', UNVOTE_WITNESS);
