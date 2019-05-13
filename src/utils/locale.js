/* eslint-disable import/prefer-default-export */
import { LOCALE_COOKIE_KEY, LOCALE_COOKIE_EXPIRES } from 'constants/config';

export function setLocaleCookie(locale) {
  document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; path=/; expires=${LOCALE_COOKIE_EXPIRES}`;
}
