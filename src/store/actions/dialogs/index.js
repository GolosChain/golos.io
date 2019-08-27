import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_TRANSFER, SHOW_MODAL_DELEGATE, SHOW_MODAL_CONVERT } from 'store/constants';

// import { showLoginModal } from '../modals';
// async function checkedLoggedUser(currentUsername) {
//   if (!currentUsername && !(await showLoginModal())) {
//     return false;
//   }
//   return true;
// }

export function openTransferDialog(recipientName = '', type = 'query', donatePostUrl = '') {
  // if (await checkedLoggedUser(currentUsername)) { // TODO:

  return openModal(SHOW_MODAL_TRANSFER, {
    recipientName,
    type,
    donatePostUrl,
  });
}

export function openDelegateDialog(recipientName) {
  return openModal(SHOW_MODAL_DELEGATE, {
    recipientName,
  });
}

export function openConvertDialog() {
  return openModal(SHOW_MODAL_CONVERT);
}
