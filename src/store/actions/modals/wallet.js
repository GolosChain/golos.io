import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_TRANSFER, SHOW_MODAL_DELEGATE, SHOW_MODAL_CONVERT } from 'store/constants';
import { currentUserIdSelector } from 'store/selectors/auth';
import { showLoginOldDialog } from './login';

export const openTransferDialog = (
  recipientName = '',
  type = 'query',
  donatePostUrl = ''
) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId && !(await dispatch(showLoginOldDialog()))) {
    return false;
  }

  return await dispatch(
    openModal(SHOW_MODAL_TRANSFER, {
      recipientName,
      type,
      donatePostUrl,
    })
  );
};

export function openDelegateDialog(recipientName) {
  return openModal(SHOW_MODAL_DELEGATE, {
    recipientName,
  });
}

export function openConvertDialog() {
  return openModal(SHOW_MODAL_CONVERT);
}
