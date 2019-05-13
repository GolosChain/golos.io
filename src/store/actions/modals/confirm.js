import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_CONFIRM, MODAL_CONFIRM } from 'store/constants/modalTypes';

// eslint-disable-next-line import/prefer-default-export
export const openConfirmDialog = (text, params) => async dispatch => {
  const result = await dispatch(openModal(SHOW_MODAL_CONFIRM, { text, params }));

  return result ? result.status === MODAL_CONFIRM : false;
};
