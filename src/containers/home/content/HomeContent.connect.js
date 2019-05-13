import { connect } from 'react-redux';

import { statusSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { fetchPosts } from 'store/actions/gate/posts';

import HomeContent from './HomeContent';

const DEFAULT_LAYOUT = 'list';

export default connect(
  state => {
    const feedStatus = statusSelector('feed')(state);
    const loggedUserId = currentUnsafeUserIdSelector(state);

    return {
      posts: feedStatus.order,
      fetchError: Boolean(feedStatus.error),
      sequenceKey: feedStatus.sequenceKey,
      isFetching: feedStatus.isLoading,
      isEnd: feedStatus.isEnd,
      loggedUserId,
      layout: DEFAULT_LAYOUT,
    };
  },
  {
    fetchPosts,
  }
)(HomeContent);
