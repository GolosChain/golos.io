import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { formatContentId } from 'store/schemas/gate';
import { statusSelector, dataSelector } from 'store/selectors/common';
import { isUnsafeAuthorized } from 'store/selectors/auth';
import { getCommentsHierarchy } from 'store/selectors/comments';
import { fetchPostComments } from 'store/actions/gate/comments';
import { UICommentSortSelector } from 'store/selectors/ui';

import CommentsContainer from './CommentsContainer';

export default connect(
  // createSelector(
  //   [routePostSelector, commentsSelector, locationSelector, state => state.ui.common],
  //   (data, commentsData, location, uiCommon) => ({
  //     pathname: location.get('pathname'),
  //     data,
  //     commentInputFocused: uiCommon.get('commentInputFocused'),
  //     ...commentsData,
  //   })
  // ),
  createSelector(
    [
      (state, props) =>
        getCommentsHierarchy(UICommentSortSelector(state), props.post.contentId)(state),
      (state, props) =>
        statusSelector(['postComments', formatContentId(props.post.contentId)])(state),
      isUnsafeAuthorized,
      dataSelector(['auth', 'isAutoLogging']),
    ],
    (list, status = {}, isAuthorized, isAutoLogging) => {
      return {
        list,
        isLoading: status.isLoading,
        isEnd: status.isEnd,
        sequenceKey: status.sequenceKey,
        isAuthorized,
        isAutoLogging,
      };
    }
  ),
  {
    fetchPostComments,
  }
)(CommentsContainer);
