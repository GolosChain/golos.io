import { CYBERWAY_API } from 'store/middlewares/cyberway-api';
import { currentUserIdSelector } from 'store/selectors/auth';

function generateRandomProposalName() {
  const numbers = [];

  for (let i = 0; i < 10; i++) {
    numbers.push(Math.floor(Math.random() * 5 + 1));
  }

  return `pr${numbers.join('')}`;
}

export const createPropose = ({ contract, method, params, requested, expires }) => async (
  dispatch,
  getState
) => {
  const userId = currentUserIdSelector(getState());

  const trx = await dispatch({
    [CYBERWAY_API]: {
      contract,
      method,
      params,
      auth: { accountName: requested.actor, permission: requested.permission },
      options: {
        msig: true,
        msigExpires: expires,
      },
    },
  });

  const proposeParams = {
    proposer: userId,
    proposal_name: generateRandomProposalName(),
    requested: [requested],
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

export const setPublishParams = ({ curatorMin, curatorMax }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const params = {
    params: [
      [
        'st_curators_prcnt',
        {
          min_curators_prcnt: curatorMin,
          max_curators_prcnt: curatorMax,
        },
      ],
    ],
  };

  return dispatch(
    createPropose({
      contract: 'publish',
      method: 'setparams',
      params,
      requested: { actor: 'gls.publish', permission: 'active' },
      expires: 36000,
    })
  );
};
