import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { closeModal } from 'redux-modals-manager';

import ModalManager from './ModalManager';

export default connect(
  createStructuredSelector({
    modals: state => state.modals,
  }),
  {
    closeModal,
  }
)(ModalManager);
