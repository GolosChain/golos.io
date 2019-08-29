import { connect } from 'react-redux';

import { showFollowersDialog } from 'store/actions/modals';

import UserCardAbout from './UserCardAbout';

export default connect(
  null,
  {
    showFollowersDialog,
  }
)(UserCardAbout);
