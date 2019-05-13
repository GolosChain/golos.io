import { connect } from 'react-redux';

// import { toggleFavorite } from 'app/redux/actions/favorites';
// import { togglePin } from 'app/redux/actions/pinnedPosts';
// import { postSelector } from 'app/redux/selectors/post/commonPost';
// import { currentUsernameSelector, dataSelector, globalSelector } from 'store/selectors/auth';
// import { extractPinnedPosts } from 'app/redux/selectors/account/pinnedPosts';

import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import CardPost from './CardPost';

export default connect(
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
        isOwner,
        isFavorite,
      };
    }
  ),
  {
    togglePin: () => () => console.error('Unhandled action'),
  }
)(CardPost);
