import ToastsManager from 'toasts-manager';

import { normalizeCyberwayErrorMessage } from './errors';

export function displayError(title, err) {
  // eslint-disable-next-line no-param-reassign
  title = title.endsWith(':') ? title : `${title}:`;

  // eslint-disable-next-line no-console
  console.error(title, err);

  const message = normalizeCyberwayErrorMessage(err);

  ToastsManager.error(`${title} ${message}`);
}

export function displayMessage(text) {
  ToastsManager.info(text);
}
