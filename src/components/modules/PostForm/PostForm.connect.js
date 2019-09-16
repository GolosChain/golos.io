import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchPost } from 'store/actions/gate';
import { createPost, updatePost } from 'store/actions/complex/content';
import { waitForTransaction } from 'store/actions/gate/content';
import { resolveUsername } from 'store/actions/storeSelectors';
import { vote } from 'store/actions/complex/votes';
import { currentUnsafeUserSelector } from 'store/selectors/auth';
import { selfVoteSelector } from 'store/selectors/settings';

import PostForm from './PostForm';

const DEFAULT_CURATION_PERCENT = 5000;

export default connect(
  createSelector(
    [currentUnsafeUserSelector, selfVoteSelector, (_, props) => props.post],
    (currentUser, selfVote, post) => ({
      currentUser,
      selfVote,
      curationPercent: post ? Number(post.payout.meta.curatorsPercent) : DEFAULT_CURATION_PERCENT,
    })
  ),
  {
    createPost,
    updatePost,
    fetchPost,
    vote,
    waitForTransaction,
    resolveUsername,
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
    fetchChainProperties: () => ({
      type: 'global/FETCH_CHAIN_PROPERTIES',
    }),
  }
)(PostForm);
