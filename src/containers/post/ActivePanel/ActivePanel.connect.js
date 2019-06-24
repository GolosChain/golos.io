import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_REPOST } from 'store/constants';
import { currentUsernameSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';
// import { openPromoteDialog } from 'app/redux/actions/dialogs';
// import {
//   authorSelector,
//   currentPostSelector,
//   routePostSelector,
// } from 'app/redux/selectors/post/commonPost';

import ActivePanel from './ActivePanel';

export default connect(
  // createSelector(
  //   [currentPostSelector, authorSelector, currentUsernameSelector, routePostSelector],
  //   (post, author, username, data) => ({
  //     post,
  //     data,
  //     username,
  //     permLink: post.permLink,
  //     account: author.account,
  //     isPinned: author.pinnedPostsUrls.includes(`${author.account}/${post.permLink}`),
  //     isOwner: username === author.account,
  //   })
  // ),
  createSelector(
    [
      currentUsernameSelector,
      (state, props) => props.post,
      dataSelector(['favorites', 'postsList']),
    ],
    (currentUsername, post, favoritePosts = []) => {
      const isOwner = currentUsername === post.author;
      const isFavorite = favoritePosts.some(favoritePost => favoritePost === post.id);
      return {
        username: currentUsername,
        isOwner,
        isFavorite,
      };
    }
  ),
  {
    openPromoteDialog: () => () => console.error('Unhandled action'),
    openRepostDialog: params => openModal(SHOW_MODAL_REPOST, params),
  }
)(ActivePanel);
