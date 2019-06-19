import { connect } from 'react-redux';

import { pin, unpin } from 'store/actions/cyberway';
import { currentUserIdSelector } from 'store/selectors/auth';

import Follow from './Follow';

export default connect(
  state => {
    const currentUserId = currentUserIdSelector(state);

    return {
      currentUserId,
    };
  },
  {
    pin,
    unpin,
  }
)(Follow);
