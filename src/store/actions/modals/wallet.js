import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_TRANSFER, SHOW_MODAL_DELEGATE, SHOW_MODAL_CONVERT } from 'store/constants';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { showLoginOldDialog } from './login';

export const openTransferDialog = ({
  type = 'transfer',
  recipientName,
  amount,
  token,
  memo = '',
}) => async (dispatch, getState) => {
  const userId = currentUnsafeUserIdSelector(getState());

  if (!userId && !(await dispatch(showLoginOldDialog()))) {
    return false;
  }

  return dispatch(
    openModal(SHOW_MODAL_TRANSFER, {
      type,
      recipientName,
      amount,
      token,
      memo,
    })
  );
};

export function openDelegateDialog(recipientUserId) {
  return openModal(SHOW_MODAL_DELEGATE, {
    recipientUserId,
  });
}

export function openConvertDialog() {
  return openModal(SHOW_MODAL_CONVERT);
}
