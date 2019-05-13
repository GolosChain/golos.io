import cyber from 'cyber-client';

import { defaults } from 'utils/common';

export const CYBERWAY_RPC = 'CYBERWAY';

export default () => next => async action => {
  if (!action || !action[CYBERWAY_RPC]) {
    return next(action);
  }

  const callApi = defaults(action[CYBERWAY_RPC], {
    options: { providebw: false, broadcast: true },
  });

  const actionWithoutCall = { ...action };
  delete actionWithoutCall[CYBERWAY_RPC];

  const { types, method, params } = callApi;
  const [requestType, successType, failureType] = types;

  next({
    ...actionWithoutCall,
    type: requestType,
    payload: null,
    error: null,
  });

  try {
    const result = await cyber.rpc[method](params);

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
