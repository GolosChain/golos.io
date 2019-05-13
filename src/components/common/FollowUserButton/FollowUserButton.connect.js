import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { pin, unpin } from 'store/actions/cyberway/social';
import { statusSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';

import FollowUserButton from './FollowUserButton';

export default connect(
  createSelector(
    [statusSelector('user'), currentUserIdSelector],
    (userStatus, currentUserId) => ({
      isLoading: userStatus.isLoadingFollow,
      currentUserId,
      isFollowed: false,
    })
  ),
  {
    followUser: pin,
    unfollowUser: unpin,
  }
)(FollowUserButton);
