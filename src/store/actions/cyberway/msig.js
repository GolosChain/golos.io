import { toPairs } from 'ramda';
import { CYBERWAY_API } from 'store/middlewares/cyberway-api';
import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  APPROVE_PROPOSAL,
  APPROVE_PROPOSAL_SUCCESS,
  APPROVE_PROPOSAL_ERROR,
  EXEC_PROPOSAL,
  EXEC_PROPOSAL_SUCCESS,
  EXEC_PROPOSAL_ERROR,
} from 'store/constants';
import { currentUserIdSelector } from 'store/selectors/auth';

function generateRandomProposalName() {
  const numbers = [];

  for (let i = 0; i < 10; i++) {
    numbers.push(Math.floor(Math.random() * 5 + 1));
  }

  return `pr${numbers.join('')}`;
}

export const createPropose = ({
  contract,
  method,
  params,
  actor,
  permission,
  requested,
  expires,
}) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  const trx = await dispatch({
    [CYBERWAY_API]: {
      contract,
      method,
      params,
      auth: { accountName: actor, permission: permission },
      options: {
        msig: true,
        msigExpires: expires,
      },
    },
  });

  const proposeParams = {
    proposer: userId,
    proposal_name: generateRandomProposalName(),
    requested: requested,
    trx,
  };

  return await dispatch({
    [CYBERWAY_API]: {
      contract: 'cyberMsig',
      method: 'propose',
      params: proposeParams,
    },
  });
};

export const setParams = ({ contractName, updates, params }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const results = await dispatch({
    [CALL_GATE]: {
      method: 'content.getLeadersTop',
      params: {
        communityId: 'gls',
        limit: 21,
      },
    },
  });

  const requestedAuth = results.items.map(({ userId }) => ({
    actor: userId,
    permission: 'active',
  }));

  const structures = toPairs(updates);

  if (structures.length === 0) {
    throw new Error('No changes');
  }

  return await dispatch(
    createPropose({
      contract: contractName,
      method: 'setparams',
      actor: `gls.${contractName}`,
      permission: 'active',
      params: {
        ...params,
        params: structures,
      },
      requested: requestedAuth,
      expires: 2592000, // в секундах (2592000 = 30 суток)
    })
  );
};

export const approveProposal = ({ proposer, proposalId }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return await dispatch({
    [CYBERWAY_API]: {
      contract: 'cyberMsig',
      method: 'approve',
      types: [APPROVE_PROPOSAL, APPROVE_PROPOSAL_SUCCESS, APPROVE_PROPOSAL_ERROR],
      params: {
        proposer: proposer,
        proposal_name: proposalId,
        level: {
          actor: userId,
          permission: 'active',
        },
      },
    },
    meta: {
      proposer,
      proposalId,
      userId,
    },
  });
};

export const execProposal = ({ proposer, proposalId }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return await dispatch({
    [CYBERWAY_API]: {
      contract: 'cyberMsig',
      method: 'exec',
      types: [EXEC_PROPOSAL, EXEC_PROPOSAL_SUCCESS, EXEC_PROPOSAL_ERROR],
      params: {
        proposer: proposer,
        proposal_name: proposalId,
        executer: userId,
      },
    },
    meta: {
      proposer: proposer,
      proposalId: proposalId,
    },
  });
};
