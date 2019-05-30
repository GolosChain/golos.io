import ToastsManager from 'toasts-manager';

import { normalizeCyberwayErrorMessage } from './errors';

export function displaySuccess(text) {
  ToastsManager.info(text);
}

export function displayError(title, err) {
  if (typeof title !== 'string') {
    err = title;
    title = null;
  }

  let prefix = null;

  if (title) {
    prefix = title;

    if (err && !title.endsWith(':')) {
      prefix = `${prefix}:`;
    }
  }

  if (prefix && err) {
    console.error(prefix, err);
  } else if (err) {
    console.error(err);
  }

  let message = '';

  if (err) {
    message = normalizeCyberwayErrorMessage(err);
  }

  ToastsManager.error(`${prefix ? `${prefix} ` : ''}${message}`);
}
