import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LOGIN, SHOW_MODAL_LOGIN_OLD } from 'store/constants';

export function showLoginDialog(params) {
  return openModal(SHOW_MODAL_LOGIN, params);
}

export function showLoginOldDialog() {
  return openModal(SHOW_MODAL_LOGIN_OLD);
}
