import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_VOTERS, SHOW_MODAL_QR_KEY, SHOW_MODAL_PAYOUT_INFO } from 'store/constants';

export function openVotersDialog(params) {
  return openModal(SHOW_MODAL_VOTERS, params);
}

export function showQrKeyDialog(params) {
  return openModal(SHOW_MODAL_QR_KEY, params);
}

export function showPayoutDialog(postLink) {
  return openModal(SHOW_MODAL_PAYOUT_INFO, { postLink });
}
