import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { currentUsernameSelector } from 'store/selectors/auth';
// import { followSelector } from 'app/redux/selectors/follow/follow';
// import { updateFollow } from 'app/redux/actions/follow';

// import { confirmUnfollowDialog } from 'app/redux/actions/dialogs';

import Follow from './Follow';

export default connect(
  () => ({
    username: 'who-is-it',
    isFollow: false,
  }),
  {
    updateFollow: () => () => console.error('Unhandled action'),
    confirmUnfollowDialog: () => () => console.error('Unhandled action'),
  }
)(Follow);
