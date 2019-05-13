import { connect } from 'react-redux';

import { statusSelector, profileSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { UIModeSelector } from 'store/selectors/ui';
import { fetchPosts } from 'store/actions/gate/posts';

import BlogContent from './BlogContent';

export default connect(
  (state, props) => {
    const feedStatus = statusSelector('feed')(state);
    const currentUserId = currentUnsafeUserIdSelector(state);

    return {
      profile: profileSelector(props.userId)(state),
      posts: feedStatus.order,
      sequenceKey: feedStatus.sequenceKey,
      currentUsername: null,
      isFetching: feedStatus.isLoading,
      isEnd: feedStatus.isEnd,
      category: null,
      order: '',
      layout: UIModeSelector('layout')(state),
      tagsStr: '',
      isOwner: currentUserId && props.userId === currentUserId,
    };
  },
  {
    fetchPosts,
  }
)(BlogContent);
