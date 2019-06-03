/* eslint-disable no-console */
import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_REPOST } from '/store/constants';
import { dataSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { nsfwTypeSelector } from 'store/selectors/settings';

import { addFavorite, removeFavorite, fetchFavorites, fetchPost } from 'store/actions/gate';

import PostCard from './PostCard';

export default connect(
  (state, props) => {
    const post = entitySelector('posts', props.id)(state);
    const author = entitySelector('users', post?.author)(state);
    const userId = currentUserIdSelector(state);
    const favoritePosts = dataSelector(['favorites', 'postsList'])(state) || [];
    const isFavorite = favoritePosts.some(favoritePost => favoritePost === props.id);

    const nsfwType = nsfwTypeSelector(state);
    let hideNsfw;
    let warnNsfw;
    if (post?.content?.tags?.includes('nsfw')) {
      hideNsfw = nsfwType === 'hide';
      warnNsfw = nsfwType === 'warn';
    }

    const isOwner = userId && post && post.author === userId;

    return {
      post,
      author,
      isOwner,
      allowRepost: !isOwner,
      isFavorite,
      hideNsfw,
      warnNsfw,
      currentUserId: userId,
    };
  },
  {
    addFavorite,
    removeFavorite,
    fetchFavorites,
    fetchPost,
    togglePin: () => () => console.error('Unhandled action'),
    openRepostDialog: params => openModal(SHOW_MODAL_REPOST, params),
  }
)(PostCard);
