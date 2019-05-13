import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { statusSelector } from 'store/selectors/common';
import { fetchReplies } from 'store/actions/gate';

import RepliesContent from './RepliesContent';

export default connect(
  (state, props) => {
    const currentUserId = currentUnsafeUserIdSelector(state);
    const repliesStatus = statusSelector('replies')(state);

    return {
      pageAccount: {},
      replies: repliesStatus.order,
      fetchError: Boolean(repliesStatus.error),
      sequenceKey: repliesStatus.sequenceKey,
      isLoading: repliesStatus.isLoading,
      isOwner: currentUserId && props.userId === currentUserId,
      isEnd: repliesStatus.isEnd,
    };
  },
  {
    fetchReplies,
  }
)(RepliesContent);
