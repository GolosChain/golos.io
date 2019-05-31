import { CHANGE_LOCALE } from 'store/constants';

// eslint-disable-next-line import/prefer-default-export
export const changeLocale = locale => ({
  type: CHANGE_LOCALE,
  payload: {
    locale,
  },
});
