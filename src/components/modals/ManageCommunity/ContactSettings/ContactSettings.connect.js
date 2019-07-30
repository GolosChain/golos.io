import { connect } from 'react-redux';

import { waitForTransaction } from 'store/actions/gate';
import { setParams } from 'store/actions/cyberway';

import ContactSettings from './ContactSettings';

export default connect(
  null,
  {
    setParams,
    waitForTransaction,
  },
  null,
  {
    forwardRef: true,
  }
)(ContactSettings);
