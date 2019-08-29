/* eslint-disable no-console */

import { connect } from 'react-redux';

import { createDeepEqualSelector, entitySelector } from 'store/selectors/common';
import { currentUserSelector } from 'store/selectors/auth';

// import extractContent from 'utils/extractContent';
// import { currentUsernameSelector } from 'store/selectors/auth';
// import { onVote } from 'app/redux/actions/vote';
// import { showNotification } from 'app/redux/actions/ui';
import { waitForTransaction, fetchPost, fetchPostComments } from 'store/actions/gate';
import { deleteComment } from 'store/actions/complex/content';

import CommentCard from './CommentCard';

export default connect(
  createDeepEqualSelector(
    [
      (state, props) => {
        const comment = entitySelector(props.entityName || 'postComments', props.id)(state);
        const author = entitySelector('users', comment.author)(state);
        return { comment, author };
      },
      currentUserSelector,
    ],
    ({ comment, author }, currentUser) => ({
      comment,
      author,
      username: currentUser?.username,
      isOwner: Boolean(currentUser && currentUser.userId === author.id),
    })
  ),
  // createSelector(
  //   [
  //     appSelector('location'),
  //     currentUsernameSelector,
  //     globalSelector('content'),
  //     (_, props) => props.permLink,
  //   ],
  //   (location, username, content, permLink) => {
  //     const comment = content.get(permLink);
  //     if (!comment) {
  //       return {
  //         dataLoaded: false,
  //         title: '',
  //         isOwner: true,
  //       };
  //     }
  //     const extractedContent = extractContent(comment);
  //     const isOwner = username === comment.get('author');
  //     const payout =
  //       parseFloat(comment.get('pending_payout_value')) +
  //       parseFloat(comment.get('total_payout_value'));
  //
  //     let { title } = extractedContent;
  //     if (comment.get('parent_author')) {
  //       title = comment.get('root_title');
  //     }
  //
  //     const fullParentUrl = comment.get('url').split('#')[0];
  //
  //     return {
  //       comment,
  //       location,
  //       fullParentUrl,
  //       stats: comment.stats,
  //       title,
  //       extractedContent,
  //       isOwner,
  //       username,
  //       payout,
  //       anchorId: `@${permLink}`,
  //       dataLoaded: true,
  //     };
  //   }
  // ),
  {
    deleteComment,
    waitForTransaction,
    fetchPost,
    fetchPostComments,
  },
  null,
  { forwardRef: true }
)(CommentCard);
