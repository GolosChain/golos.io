import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { modalsMiddleware } from 'redux-modals-manager';
import ToastsManager from 'toasts-manager';

import { apiMiddleware, rpcMiddleware, apiGateMiddleware } from 'store/middlewares';

import rootReducer from 'store/reducers';
import { login, logout, getNotificationsCount } from 'store/actions/gate';
import { userCyberStakeBalanceSelector } from 'store/selectors/wallet';
import { getAuth } from 'utils/localStorage';
import OnlineNotification from 'components/common/OnlineNotification';
import { currentUserIdSelector } from './selectors/auth';

function autoLogin() {
  let auth;

  try {
    auth = getAuth();
  } catch (err) {
    // eslint-disable-next-line
    console.error('Invalid authorization data:', err);
    return logout();
  }

  if (!auth) {
    // Если auth нет, то делаем logout чтобы сбросить на всякий случай cookie
    return logout();
  }

  const { userId, privateKey } = auth;

  return login(userId, privateKey, { isAutoLogging: true });
}

function onNotifications(notifications, { dispatch }) {
  dispatch(getNotificationsCount());

  for (const notification of notifications) {
    ToastsManager.show(() => <OnlineNotification notification={notification} />);
  }
}

function shouldUseBW({ getState }) {
  const state = getState();
  const userId = currentUserIdSelector(state);
  const balance = userCyberStakeBalanceSelector(userId, 'staked')(state);

  return balance < (process.env.BANDWIDTH_PROVIDE_THRESHOLDER || 100);
}

export default (state = {}) => {
  const middlewares = [
    thunkMiddleware,
    apiMiddleware({
      shouldUseBW,
    }),
    rpcMiddleware,
    apiGateMiddleware({
      autoLogin,
      onNotifications,
    }),
    modalsMiddleware,
  ];

  if (process.env.NODE_ENV !== 'production' && (process.env.REDUX_LOGGER || process.browser)) {
    // eslint-disable-next-line
    const { createLogger } = require('redux-logger');
    middlewares.push(createLogger());
  }

  const store = createStore(
    rootReducer,
    state,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV === 'development' && process.browser) {
    // eslint-disable-next-line no-underscore-dangle
    window.__store = store;
  }

  return store;
};
