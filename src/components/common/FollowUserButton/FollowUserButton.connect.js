import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { pin, unpin } from 'store/actions/cyberway/social';
import { waitForTransaction } from 'store/actions/gate';
import { showUnfollowAlert } from 'store/actions/modals';
import { fetchProfile } from 'store/actions/gate/user';
import { statusSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';

import FollowUserButton from './FollowUserButton';

export default connect(
  createSelector(
    [
      statusSelector('user'),
      currentUserIdSelector,
      (state, props) => entitySelector('profiles', props.targetUserId)(state),
    ],
    (userStatus, currentUserId, profile) => ({
      isLoading: userStatus.isLoadingFollow,
      currentUserId,
      isFollowed: profile?.isSubscribed || false,
    })
  ),
  {
    followUser: pin,
    unfollowUser: unpin,
    fetchProfile,
    waitForTransaction,
    showUnfollowAlert,
  }
)(FollowUserButton);
