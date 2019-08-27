import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_LOGIN } from 'store/constants';
import DialogManager from 'components/elements/common/DialogManager';
import LoginForm from 'containers/login/LoginForm';

export function showLoginDialog(params) {
  return openModal(SHOW_MODAL_LOGIN, params);
}

// OLD
export function showLoginModal() {
  return new Promise(resolve => {
    DialogManager.showDialog({
      component: LoginForm,
      props: {},
      onClose: resolve,
    });
  });
}
