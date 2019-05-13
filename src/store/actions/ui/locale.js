/* eslint-disable import/prefer-default-export */
import { CHANGE_LOCALE } from 'store/constants';

export const changeLocale = locale => ({
  type: CHANGE_LOCALE,
  payload: {
    locale,
  },
});
