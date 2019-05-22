import { connect } from 'react-redux';

import { pin, unpin } from 'store/actions/cyberway';

import Follow from './Follow';

export default connect(
  null,
  {
    pin,
    unpin,
  }
)(Follow);
