import { connect } from 'react-redux';

import { waitForTransaction } from 'store/actions/gate';
import { setPublishParams } from 'store/actions/cyberway';

import ContactSettings from './ContactSettings';

export default connect(
  null,
  {
    setPublishParams,
    waitForTransaction,
  },
  null,
  {
    forwardRef: true,
  }
)(ContactSettings);
