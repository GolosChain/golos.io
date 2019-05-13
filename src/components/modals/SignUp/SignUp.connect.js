import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { setScreenId, setLocalStorageData } from 'store/actions/registration';
import { openConfirmDialog } from 'store/actions/modals/confirm';

import SignUp from './SignUp';

export default connect(
  state => ({
    screenId: state.data.registration.screenId,
  }),
  {
    setScreenId,
    openModal,
    setLocalStorageData,
    openConfirmDialog,
  }
)(SignUp);
