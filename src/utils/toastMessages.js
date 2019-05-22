import ToastsManager from 'toasts-manager';

import { normalizeCyberwayErrorMessage } from './errors';

export function displayMessage(text) {
  ToastsManager.info(text);
}

export function displayError(title, err) {
  if (arguments.length === 1) {
    err = title;
    title = null;
  }

  let prefix = null;

  if (title) {
    prefix = title.endsWith(':') ? title : `${title}:`;
  }

  if (prefix) {
    console.error(prefix, err);
  } else {
    console.error(err);
  }

  const message = normalizeCyberwayErrorMessage(err);

  ToastsManager.error(`${prefix ? `${prefix} ` : ''}${message}`);
}
