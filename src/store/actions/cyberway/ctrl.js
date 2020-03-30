import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

import {
  VOTE_WITNESS,
  UNVOTE_WITNESS,
  REG_WITNESS,
  REG_WITNESS_SUCCESS,
  REG_WITNESS_ERROR,
  STOP_WITNESS,
  STOP_WITNESS_SUCCESS,
  STOP_WITNESS_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const CONTRACT_NAME = 'ctrl';

const makeVoteWitnessAction = (methodName, actionName) => witness => (dispatch, getState) => {
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

export const voteWitness = makeVoteWitnessAction('votewitness', VOTE_WITNESS);
export const unvoteWitness = makeVoteWitnessAction('unvotewitn', UNVOTE_WITNESS);

export const registerWitness = ({ url }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    witness: userId,
    url,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [REG_WITNESS, REG_WITNESS_SUCCESS, REG_WITNESS_ERROR],
      contract: CONTRACT_NAME,
      method: 'regwitness',
      params: data,
    },
    meta: data,
  });
};

export const stopLeader = () => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    witness: userId,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [STOP_WITNESS, STOP_WITNESS_SUCCESS, STOP_WITNESS_ERROR],
      contract: CONTRACT_NAME,
      method: 'stopwitness',
      params: data,
    },
    meta: data,
  });
};
