import { connect } from 'react-redux';

import { statusSelector, profileSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { UIModeSelector } from 'store/selectors/ui';
import { fetchUserComments, fetchPost } from 'store/actions/gate/comments';

import CommentsContent from './CommentsContent';

export default connect(
  (state, props) => {
    const status = statusSelector('profileComments')(state);
    const currentUserId = currentUnsafeUserIdSelector(state);

    return {
      profile: profileSelector(props.userId)(state),
      comments: status.order,
      sequenceKey: status.sequenceKey,
      currentUsername: null,
      isFetching: status.isLoading,
      isEnd: status.isEnd,
      layout: UIModeSelector('layout')(state),
      isOwner: currentUserId && props.userId === currentUserId,
    };
  },
  {
    fetchUserComments,
  }
)(CommentsContent);
