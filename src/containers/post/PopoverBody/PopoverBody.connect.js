import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';

import PopoverBody from './PopoverBody';

export default connect(
  createSelector(
    [(state, props) => entitySelector('profiles', props.userId)(state), currentUserIdSelector],
    (profile, currentUserId) => {
      return {
        profile,
        pinnedPosts: [],
        pinnedPostsUrls: [],
        showFollowBlock: profile?.userId !== currentUserId,
      };
    }
  ),
  {
    getPostContent: urls => ({
      type: 'USER_PINNED_POSTS_LOAD',
      payload: {
        urls,
      },
    }),
  }
)(PopoverBody);
