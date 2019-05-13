import DialogManager from 'components/elements/common/DialogManager';
import TransferDialog from 'components/dialogs/TransferDialog';
import DelegateDialog from 'components/dialogs/DelegateDialog';
import ConvertDialog from 'components/dialogs/ConvertDialog';

import { showLoginModal } from 'store/actions/modals/index';
import { displayError } from 'utils/toastMessages';

async function checkedLoggedUser(currentUsername) {
  if (!currentUsername && !(await showLoginModal())) {
    return false;
  }
  return true;
}

export async function openTransferDialog(
  currentUsername,
  accountUsername,
  type = 'query',
  donatePostUrl = ''
) {
  try {
    if (await checkedLoggedUser(currentUsername)) {
      await new Promise(resolve => {
        DialogManager.showDialog({
          component: TransferDialog,
          props: {
            recipientName: accountUsername,
            type,
            donatePostUrl,
          },
          onClose: resolve,
        });
      });
    }
  } catch (err) {
    displayError('Open dialog failed', err);
  }
}

export function openDelegateDialog(accountUsername) {
  return new Promise(resolve => {
    DialogManager.showDialog({
      component: DelegateDialog,
      props: {
        recipientName: accountUsername,
      },
      onClose: resolve,
    });
  });
}

export function openConvertDialog() {
  return new Promise(resolve => {
    DialogManager.showDialog({
      component: ConvertDialog,
      props: {},
      onClose: resolve,
    });
  });
}
