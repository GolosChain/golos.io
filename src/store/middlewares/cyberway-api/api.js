import cyber from 'cyber-golos';

import { defaults } from 'utils/common';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { PROVIDE_BW, PROVIDE_BW_SUCCESS, PROVIDE_BW_ERROR } from 'store/constants';
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

  const { types, contract, method, params, options } = callApi;
  const [requestType, successType, failureType] = types;

  next({
    ...actionWithoutCall,
    type: requestType,
    payload: null,
    error: null,
  });

  try {
    const user = currentUserSelector(getState());
    // raw transaction if providebw option specified or result of transaction
    let result = await cyber[contract][method]({ accountName: user.userId }, params, options);

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

    next({
      ...actionWithoutCall,
      type: successType,
      payload: result,
      error: null,
    });

    return result;
  } catch (err) {
    next({
      ...actionWithoutCall,
      type: failureType,
      payload: null,
      error: err,
    });

    throw err;
  }
};
