/* eslint-disable no-console */

import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { createComment, updateComment } from 'store/actions/complex/content';
import { fetchPost, fetchPostComments, waitForTransaction } from 'store/actions/gate';

import CommentForm from './CommentForm';

export default connect(
  (state, { reply, params }) => {
    let parentAuthorUsername;

    if (reply && params.contentId) {
      parentAuthorUsername = entitySelector('users', params.contentId.userId)(state)?.username;
    }

    return {
      parentAuthorUsername,
    };
  },
  {
    createComment,
    updateComment,
    waitForTransaction,
    fetchPost,
    fetchPostComments,
    // TODO: replace with real handlers
    loginIfNeed: () => () => console.error('Unhandled action'),
    toggleCommentInputFocus: () => () => console.error('Unhandled action'),
    uploadImage: ({ file, progress }) => dispatch => {
      dispatch({
        type: 'user/UPLOAD_IMAGE',
        payload: {
          file,
          progress: data => {
            if (data && data.error) {
              // dispatch(showNotification(data.error));
            }

            progress(data);
          },
        },
      });
    },
  }
)(CommentForm);
