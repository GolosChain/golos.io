import cyber from 'cyber-client';
import { openModal } from 'redux-modals-manager';

import { defaults } from 'utils/common';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { PROVIDE_BW, PROVIDE_BW_SUCCESS, PROVIDE_BW_ERROR } from 'store/constants';
import { SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';
import { currentUserSelector } from 'store/selectors/auth';

export const CYBERWAY_API = 'CYBERWAY_API';

export default ({ getState }) => next => async action => {
  if (!action || !action[CYBERWAY_API]) {
    return next(action);
  }

  // TODO: change to providebw: true and broadcast: false when Gate will work
  const callApi = defaults(action[CYBERWAY_API], {
    options: { providebw: false, broadcast: true },
  });

  const actionWithoutCall = { ...action };
  delete actionWithoutCall[CYBERWAY_API];

  const { types, contract, method, params, options, msig } = callApi;
  const [requestType, successType, failureType] = types || [];

  if (requestType) {
    next({
      ...actionWithoutCall,
      type: requestType,
      payload: null,
      error: null,
    });
  }

  try {
    const { userId, permission, username } = currentUserSelector(getState());

    let currentPermission = permission;

    if (permission === 'posting' && contract !== 'publish') {
      const { auth } = await next(
        openModal(SHOW_MODAL_LOGIN, {
          isConfirm: true,
          keyRole: 'active',
          lockUsername: true,
          username,
        })
      );

      if (!auth) {
        throw new Error('Missing active authority');
      }

      currentPermission = 'active';
      cyber.initProvider(auth.actualKey);
    }

    let result;

    if (msig) {
      const trx = await cyber[contract][method](msig.requested, params, {
        msig: true,
        msigExpires: msig.expires,
      });

      const proposeParams = {
        proposer: userId,
        proposal_name: generateRandomProposalName(),
        requested: [
          {
            actor: 'gls.publish',
            permission: 'active',
          },
        ],
        trx,
      };

      result = await cyber.cyberMsig.propose(
        { accountName: userId, permission: currentPermission },
        proposeParams,
        options
      );
    } else {
      // raw transaction if providebw option specified or result of transaction
      result = await cyber[contract][method](
        { accountName: userId, permission: currentPermission },
        params,
        options
      );
    }

    if (options.providebw) {
      const { signatures, serializedTransaction } = result;
      const paramsProvidebw = {
        transaction: {
          signatures,
          serializedTransaction: Array.from(serializedTransaction),
        },
        chainId: cyber.api.chainId,
      };

      result = await next({
        [CALL_GATE]: {
          types: [PROVIDE_BW, PROVIDE_BW_SUCCESS, PROVIDE_BW_ERROR],
          method: 'bandwidth.provide',
          params: paramsProvidebw,
        },
        meta: paramsProvidebw,
      });
    }

    if (successType) {
      next({
        ...actionWithoutCall,
        type: successType,
        payload: result,
        error: null,
      });
    }

    return result;
  } catch (err) {
    if (failureType) {
      next({
        ...actionWithoutCall,
        type: failureType,
        payload: null,
        error: err,
      });
    }

    throw err;
  }
};

function generateRandomProposalName() {
  const numbers = [];

  for (let i = 0; i < 10; i++) {
    numbers.push(Math.floor(Math.random() * 5 + 1));
  }

  return `pr${numbers.join('')}`;
}
