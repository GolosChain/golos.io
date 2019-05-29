/* eslint-disable global-require */

import { normalize } from 'normalizr';

import { currentUnsafeServerUserIdSelector } from 'store/selectors/auth';
import { wait } from 'utils/time';
import CurrentRequests from './utils/CurrentRequests';

export const CALL_GATE = 'CALL_GATE';
const SSR_TIMEOUT = 3000;

export default ({ autoLogin, onNotifications }) => ({ getState, dispatch }) => next => {
  let client = null;

  if (process.browser) {
    const GateWsClient = require('./clients/GateWsClient').default;
    client = new GateWsClient({
      onNotifications: notifications => {
        onNotifications(notifications, { getState, dispatch });
      },
    });
  } else {
    const FacadeClient = require('./clients/FacadeClient').default;
    client = new FacadeClient();
  }

  let autoAuthPromise = null;

  if (process.browser) {
    autoAuthPromise = (async () => {
      const action = autoLogin();

      if (action) {
        // Ждем потому что нельзя dispatch'ить во время создания middleware.
        await wait(0);
        await dispatch(action);
      }
    })();
  }

  const currentRequests = new CurrentRequests();

  return async action => {
    if (!action || !action[CALL_GATE]) {
      return next(action);
    }

    const gateCall = action[CALL_GATE];

    const actionWithoutCall = { ...action };
    delete actionWithoutCall[CALL_GATE];

    const { types, method, params, schema } = gateCall;
    const [requestType, successType, failureType] = types || [];

    if (requestType && action.meta && action.meta.abortPrevious) {
      currentRequests.abortByType(requestType);
    }

    const requestInfo = {
      requestType,
      actionWithoutCall,
      isCanceled: false,
    };

    requestInfo.promise = new Promise(async (resolve, reject) => {
      requestInfo.reject = reject;

      if (requestType) {
        next({
          ...actionWithoutCall,
          type: requestType,
          payload: null,
          error: null,
        });
      }

      try {
        if (action.meta && action.meta.waitAutoLogin && autoAuthPromise) {
          await autoAuthPromise;
        }

        if (requestInfo.isCanceled) {
          return;
        }

        let userId;

        if (!process.browser) {
          userId = currentUnsafeServerUserIdSelector(getState());
        }

        let result;

        if (process.browser) {
          result = await client.callApi(method, params, userId);
        } else {
          result = await Promise.race([
            client.callApi(method, params, userId),
            timeoutError(SSR_TIMEOUT, method),
          ]);
        }

        if (requestInfo.isCanceled) {
          return;
        }

        if (schema) {
          try {
            result = normalize(result, schema);
          } catch (err) {
            err.message = `Normalization failed: ${err.message}`;
            reject(err);
            return;
          }
        }

        if (successType) {
          next({
            ...actionWithoutCall,
            type: successType,
            payload: result,
            error: null,
          });
        }

        resolve(result);
      } catch (err) {
        if (requestInfo.isCanceled) {
          return;
        }

        if (failureType) {
          next({
            ...actionWithoutCall,
            type: failureType,
            payload: null,
            error: err,
          });
        }

        reject(err);
      }
    });

    currentRequests.add(requestInfo);

    const result = await requestInfo.promise;

    currentRequests.remove(requestInfo);

    return result;
  };
};

function timeoutError(ms, apiName) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout ${apiName}`));
    }, ms);
  });
}
