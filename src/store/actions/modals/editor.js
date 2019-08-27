import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LINK_OPTIONS } from 'store/constants';

export function showLinkOptionsDialog(params) {
  return openModal(SHOW_MODAL_LINK_OPTIONS, params);
}
