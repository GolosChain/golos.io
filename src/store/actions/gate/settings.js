import tt from 'counterpart';

import { DEFAULT_LOCALE } from 'constants/config';
import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  FETCH_SETTINGS,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_ERROR,
  UPDATE_SETTINGS,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_ERROR,
} from 'store/constants';
import { displayError } from 'utils/toastMessages';
import { setLocaleCookie } from 'utils/locale';
import { changeLocale } from 'store/actions/ui/locale';

export const fetchSettings = () => async (dispatch, getState) => {
  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_SETTINGS, FETCH_SETTINGS_SUCCESS, FETCH_SETTINGS_ERROR],
        method: 'options.get',
        params: {
          profile: 'web',
          app: 'gls',
        },
      },
      meta: {
        waitAutoLogin: true,
      },
    });

    const lang = getState().data.settings.basic?.lang || DEFAULT_LOCALE;
    setLocaleCookie(lang);
    dispatch(changeLocale(lang));
  } catch (err) {
    displayError(tt('g.error'), err);
  }
};

export const updateSettings = options => async (dispatch, getState) => {
  try {
    await dispatch({
      [CALL_GATE]: {
        types: [UPDATE_SETTINGS, UPDATE_SETTINGS_SUCCESS, UPDATE_SETTINGS_ERROR],
        method: 'options.set',
        params: {
          ...options,
          profile: 'web',
          app: 'gls',
        },
      },
      meta: {
        waitAutoLogin: true,
        options,
      },
    });

    const lang = getState().data.settings.basic?.lang || DEFAULT_LOCALE;
    setLocaleCookie(lang);
    dispatch(changeLocale(lang));
  } catch (err) {
    displayError(tt('g.error'), err);
  }
};
