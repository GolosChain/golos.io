import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LINK_OPTIONS, SHOW_MODAL_ADD_IMAGE } from 'store/constants';

export function showLinkOptionsDialog(params) {
  return openModal(SHOW_MODAL_LINK_OPTIONS, params);
}

export function showAddImageDialog(params) {
  return openModal(SHOW_MODAL_ADD_IMAGE, params);
}
