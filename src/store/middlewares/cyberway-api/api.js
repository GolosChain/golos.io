import cyber from 'cyber-client';
import { openModal } from 'redux-modals-manager';

import { defaults } from 'utils/common';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { PROVIDE_BW, PROVIDE_BW_SUCCESS, PROVIDE_BW_ERROR } from 'store/constants';
import { SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';
import { currentUserSelector } from 'store/selectors/auth';

export const CYBERWAY_API = 'CYBERWAY_API';

export default ({ shouldUseBW }) => ({ getState }) => next => async action => {
  if (!action || !action[CYBERWAY_API]) {
    return next(action);
  }

  let callApi = action[CYBERWAY_API];

  if (
    process.env.PROVIDEBW_ENABLED &&
    callApi.options?.providebw !== false &&
    shouldUseBW({ getState })
  ) {
    callApi = {
      ...callApi,
      options: defaults(callApi.options, {
        broadcast: false,
        providebw: true,
        bwprovider: 'gls',
      }),
    };
  }

  const actionWithoutCall = { ...action };
  delete actionWithoutCall[CYBERWAY_API];

  const { types, contract, method, params, options, auth } = callApi;
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

    // raw transaction if providebw option specified or result of transaction
    let result = await cyber[contract][method](
      auth || { accountName: userId, permission: currentPermission },
      params,
      options
    );

    if (options && options.providebw) {
      const { signatures, serializedTransaction } = result;

      const paramsProvidebw = {
        transaction: {
          signatures,
          serializedTransaction: uint8ArrayToHex(serializedTransaction),
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

function uint8ArrayToHex(array) {
  const result = [];

  for (const num of array) {
    let str = num.toString(16);

    if (num < 16) {
      str = `0${str}`;
    }

    result.push(str);
  }

  return result.join('');
}
