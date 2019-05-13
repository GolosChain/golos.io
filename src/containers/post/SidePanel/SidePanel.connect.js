import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';
// import { onBackClick } from 'app/redux/actions/post';
// import { onVote } from 'app/redux/actions/vote';
// import { currentPostSelector, authorSelector } from 'app/redux/selectors/post/commonPost';

import SidePanel from './SidePanel';

export default connect(
  // createSelector(
  //   [currentPostSelector, authorSelector, currentUsernameSelector, appSelector('location')],
  //   (post, author, username, location) => {
  //     const prev = location.get('previous');
  //
  //     let backURL = null;
  //     if (prev) {
  //       backURL = prev.get('pathname') + prev.get('search', '') + prev.get('hash', '');
  //     }
  //
  //     return {
  //       post,
  //       username,
  //       contentLink: `${author.account}/${post.permLink}`,
  //       isOwner: username === author.account,
  //       backURL,
  //       isPinned: author.pinnedPostsUrls.includes(`${author.account}/${post.permLink}`),
  //     };
  //   }
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
    onVote: () => () => console.error('Unhandled action'),
    onBackClick: () => () => console.error('Unhandled action'),
  }
)(SidePanel);
