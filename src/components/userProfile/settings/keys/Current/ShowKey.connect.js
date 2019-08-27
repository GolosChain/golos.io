import { connect } from 'react-redux';

import { showLoginDialog, showQrKeyDialog } from 'store/actions/modals';

import ShowKey from './ShowKey';

export default connect(
  null,
  {
    showLoginDialog,
    showQrKeyDialog,
  }
)(ShowKey);
