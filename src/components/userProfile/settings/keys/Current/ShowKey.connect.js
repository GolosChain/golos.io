import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import ShowKey from './ShowKey';

export default connect(
  null,
  {
    openModal,
  }
)(ShowKey);
