import { connect } from 'react-redux';

import { updateProfileMeta } from 'store/actions/cyberway/social';

import UserHeader from './UserHeader';

export default connect(
  null,
  {
    updateProfileMeta,
  }
)(UserHeader);
