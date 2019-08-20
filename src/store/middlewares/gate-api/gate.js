/* eslint-disable global-require */

import { normalize } from 'normalizr';

import { currentUnsafeServerUserIdSelector } from 'store/selectors/auth';
import CurrentRequests from './utils/CurrentRequests';

export const CALL_GATE = 'CALL_GATE';
const SSR_REQUEST_TIMEOUT = 5000;

export default ({ autoLogin, onNotifications }) => ({ getState, dispatch }) => next => {
  let client = null;
  let autoAuthPromise = null;
  let initialAuthPromiseResolve = null;

  if (process.browser) {
    autoAuthPromise = new Promise(resolve => {
      initialAuthPromiseResolve = resolve;
    });
  }

  if (process.browser) {
    const GateWsClient = require('./clients/GateWsClient').default;
    client = new GateWsClient({
      onConnect: async () => {
        const action = autoLogin();

        if (action) {
          autoAuthPromise = await dispatch(action);
        } else {
          autoAuthPromise = null;
        }

        initialAuthPromiseResolve();
      },
      onNotifications: notifications => {
        onNotifications(notifications, { getState, dispatch });
      },
    });
  } else {
    const FacadeClient = require('./clients/FacadeClient').default;
    client = new FacadeClient();
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
          result = await addTimeout(
            client.callApi(method, params, userId),
            method,
            SSR_REQUEST_TIMEOUT
          );
        }

        if (requestInfo.isCanceled) {
          return;
        }

        let normalizedResult = result;

        if (schema) {
          try {
            normalizedResult = normalize(result, schema);
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
            payload: normalizedResult,
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

function addTimeout(promise, methodName, timeoutMs) {
  return new Promise((resolve, reject) => {
    const startTs = Date.now();

    let isTimeouted = false;
    let timeoutId;

    promise.then(
      result => {
        if (isTimeouted) {
          const time = Date.now() - startTs;
          console.error(`Request failed: Calling ${methodName} took too long (${time}ms)`);
        } else {
          clearTimeout(timeoutId);
          resolve(result);
        }
      },
      err => {
        if (isTimeouted) {
          console.error(`Request failed: Original error in ${methodName}:`, err);
        } else {
          clearTimeout(timeoutId);
          reject(err);
        }
      }
    );

    timeoutId = setTimeout(() => {
      isTimeouted = true;
      reject(new Error(`Timeout ${methodName}`));
    }, timeoutMs);
  });
}
