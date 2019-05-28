/* eslint-disable no-shadow */
import cyber from 'cyber-client';
import { sign } from 'cyber-client/lib/auth';

import { CALL_GATE } from 'store/middlewares/gate-api';
import { saveAuth, removeAuth } from 'utils/localStorage';
import { fetchProfile } from 'store/actions/gate/user';
import { fetchSettings } from 'store/actions/gate/settings';
import { fetchFavorites } from 'store/actions/gate/favorites';
import {
  getNotificationsCount,
  subscribeNotifications,
  unsubscribeNotifications,
} from 'store/actions/gate/notifications';
import { isAuthorized } from 'store/selectors/auth';
import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
  SET_SERVER_ACCOUNT_NAME,
  GATE_AUTHORIZE_SECRET,
  GATE_AUTHORIZE_SECRET_SUCCESS,
  GATE_AUTHORIZE_SECRET_ERROR,
  GATE_AUTHORIZE,
  GATE_AUTHORIZE_SUCCESS,
  GATE_AUTHORIZE_ERROR,
} from 'store/constants';
import { Router } from 'shared/routes';
import { getBalance } from './wallet';

export const setServerAccountName = userId => ({
  type: SET_SERVER_ACCOUNT_NAME,
  payload: {
    userId,
  },
});

const getAuthSecret = () => ({
  [CALL_GATE]: {
    types: [GATE_AUTHORIZE_SECRET, GATE_AUTHORIZE_SECRET_SUCCESS, GATE_AUTHORIZE_SECRET_ERROR],
    method: 'auth.generateSecret',
    params: {},
  },
});

const gateAuthorize = (secret, user, sign) => ({
  [CALL_GATE]: {
    types: [GATE_AUTHORIZE, GATE_AUTHORIZE_SUCCESS, GATE_AUTHORIZE_ERROR],
    method: 'auth.authorize',
    params: { secret, user, sign },
  },
});

export const login = (username, privateKey, meta = {}) => async dispatch => {
  dispatch({
    type: AUTH_LOGIN,
    meta,
  });

  const { needSaveAuth = false, needGateAuthorize = true, keyRole, isAutoLogging } = meta;

  try {
    const { actualKey } = cyber.getActualAuth(username, privateKey, keyRole);

    if (needGateAuthorize) {
      const { secret } = await dispatch(getAuthSecret());

      const signature = sign(secret, actualKey);

      const auth = await dispatch(gateAuthorize(secret, username, signature));

      // TODO: should be removed. Temporary fix for mobile devices
      if (!auth) {
        return;
      }

      cyber.initProvider(actualKey);

      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: {
          userId: auth.user,
          username: auth.displayName,
          permission: auth.permission,
        },
      });

      if (needSaveAuth) {
        saveAuth(username, actualKey);
      }

      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);

      document.cookie = `golos.userId=${auth.user}; path=/; expires=${date.toGMTString()}`;

      try {
        await dispatch(fetchProfile(auth.user));
      } catch (err) {
        // replace with action if needed
        // eslint-disable-next-line no-console
        console.warn('fetch profile error');
      }

      // fetchFavorites и getBalance вынесены в таймаут, чтобы отделить их от экшена авторизации.
      // В противном случае fetchFavorites вызовет авторизацию снова что приведет к рекурсии.
      setTimeout(async () => {
        if (!isAutoLogging) {
          // Пушим роут для обновления страницу
          Router.pushRoute(Router.asPath);
        }

        try {
          await Promise.all([
            dispatch(getBalance(auth.user)),
            dispatch(fetchSettings()),
            dispatch(fetchFavorites()),
            dispatch(subscribeNotifications()),
            dispatch(getNotificationsCount()),
          ]);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }, 0);
    }
    return {
      actualKey,
    };
  } catch (err) {
    dispatch({
      type: AUTH_LOGIN_ERROR,
      error: err.message,
      meta,
    });
    throw err;
  }
};

export const logout = () => async (dispatch, getState) => {
  removeAuth();

  const state = getState();
  const isAuth = isAuthorized(state);

  document.cookie = `golos.userId=; path=/; expires=${new Date().toGMTString()}`;

  dispatch({ type: AUTH_LOGOUT, payload: {} });

  if (isAuth) {
    try {
      await dispatch(unsubscribeNotifications());
    } catch {}
  }

  dispatch({ type: AUTH_LOGOUT_SUCCESS, payload: {} });
};
