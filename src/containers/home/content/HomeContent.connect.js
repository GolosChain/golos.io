import { connect } from 'react-redux';

import { statusSelector } from 'store/selectors/common';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { fetchPosts } from 'store/actions/gate/posts';

import HomeContent from './HomeContent';

const DEFAULT_LAYOUT = 'list';

export default connect(
  state => {
    const feedStatus = statusSelector('feed')(state);
    const loggedUser = currentUnsafeUserSelector(state);

    return {
      posts: feedStatus.order,
      fetchError: Boolean(feedStatus.error),
      sequenceKey: feedStatus.sequenceKey,
      isFetching: feedStatus.isLoading,
      isEnd: feedStatus.isEnd,
      loggedUsername: loggedUser?.username,
      layout: DEFAULT_LAYOUT,
    };
  },
  {
    fetchPosts,
  }
)(HomeContent);
