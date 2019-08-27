import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_VOTERS } from 'store/constants';

export function openVotersDialog(params) {
  return openModal(SHOW_MODAL_VOTERS, params);
}
