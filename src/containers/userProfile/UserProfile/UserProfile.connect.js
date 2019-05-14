import { connect } from 'react-redux';

import { profileSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector, currentUserSelector } from 'store/selectors/auth';

import UserProfile from './UserProfile';

export default connect(
  (state, props) => {
    const user = currentUnsafeUserSelector(state);
    const profile = profileSelector(props.userId)(state);
    const currentUser = currentUserSelector(state);

    return {
      currentUser,
      profile,
      fetching: null,
      isOwner: user ? user.userId === props.userId : false,
      followerCount: 0,
      followingCount: 0,
    };
  },
  {
    uploadImage: (file, progress) => ({
      type: 'user/UPLOAD_IMAGE',
      payload: { file, progress },
    }),
    updateAccount: () => () => console.error('Unhandled action'),
  }
)(UserProfile);
