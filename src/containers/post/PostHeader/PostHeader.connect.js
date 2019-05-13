import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector, entitySelector } from 'store/selectors/common';
// import { currentPostSelector, authorSelector } from 'app/redux/selectors/post/commonPost';
// import { followingSelector } from 'app/redux/selectors/follow/follow';
// import { updateFollow } from 'app/redux/actions/follow';
// import { confirmUnfollowDialog } from 'app/redux/actions/dialogs';

import PostHeader from './PostHeader';

export default connect(
  // createSelector(
  //   [currentUsernameSelector],
  //   (post, author, username, follow) => ({
  //     username,
  //     created: post.created,
  //     isFavorite: post.isFavorite,
  //     category: post.category,
  //     isPromoted: post.promotedAmount > 0,
  //     author: author.account,
  //     isFollow: follow.includes(author.account),
  //     permLink: post.permLink,
  //     isOwner: username === author.account,
  //     isPinned: author.pinnedPostsUrls.includes(`${author.account}/${post.permLink}`),
  //   })
  // ),
  createSelector(
    [
      currentUserIdSelector,
      (state, props) => props.post,
      (state, props) => entitySelector('users', props.post.author)(state),
      dataSelector(['favorites', 'postsList']),
    ],
    (currentUserId, post, author, favoritePosts = []) => {
      const isOwner = currentUserId === post.author;
      const isFavorite = favoritePosts.some(favoritePost => favoritePost === post.id);

      return {
        author,
        isOwner,
        isFavorite,
      };
    }
  ),
  null,
  null,
  { forwardRef: true }
)(PostHeader);
