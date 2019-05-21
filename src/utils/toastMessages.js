import ToastsManager from 'toasts-manager';

import { normalizeCyberwayErrorMessage } from './errors';

export function displayError(title, err) {
  if (arguments.length === 1) {
    // eslint-disable-next-line no-param-reassign
    err = title;
    // eslint-disable-next-line no-param-reassign
    title = null;
  }

  let prefix = null;

  if (title) {
    prefix = title.endsWith(':') ? title : `${title}:`;
  }

  // eslint-disable-next-line no-console
  console.error(prefix, err);

  const message = normalizeCyberwayErrorMessage(err);

  ToastsManager.error(`${prefix ? `${prefix} ` : ''}${message}`);
}

export function displayMessage(text) {
  ToastsManager.info(text);
}
