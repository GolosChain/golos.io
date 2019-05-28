import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { registerWitness } from 'store/actions/cyberway';
import { openConfirmDialog } from 'store/actions/modals';

import BecomeLeader from './BecomeLeader';

export default connect(
  null,
  {
    registerWitness,
    openModal,
    openConfirmDialog,
  }
)(BecomeLeader);
