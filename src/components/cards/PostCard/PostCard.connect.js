/* eslint-disable no-console */
import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_REPOST } from 'store/constants';
import { dataSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { nsfwTypeSelector } from 'store/selectors/settings';

import { removeReblog } from 'store/actions/cyberway';
import { addFavorite, removeFavorite, fetchFavorites, fetchPost } from 'store/actions/gate';
import { repLog10 } from 'utils/ParsersAndFormatters';

import PostCard from './PostCard';

export default connect(
  (state, props) => {
    const post = entitySelector('posts', props.id)(state);

    const author = entitySelector('users', post?.author)(state);
    const repostAuthor = entitySelector('users', post?.repost?.userId)(state);
    const userId = currentUserIdSelector(state);
    const favoritePosts = dataSelector(['favorites', 'postsList'])(state) || [];
    const isFavorite = favoritePosts.some(favoritePost => favoritePost === props.id);

    const nsfwType = nsfwTypeSelector(state);
    let hideNsfw;
    let warnNsfw;
    if (post?.content?.metadata?.tags?.includes('nsfw')) {
      hideNsfw = nsfwType === 'hide';
      warnNsfw = nsfwType === 'warn';
    }

    const isOwner = userId && post && (post.author === userId || post.repost?.userId === userId);

    const reputation = repLog10(author?.stats?.reputation) || 0;

    return {
      post,
      author,
      repostAuthor,
      isOwner,
      isFavorite,
      hideNsfw,
      warnNsfw,
      isLowReputation: reputation < 0,
      currentUserId: userId,
    };
  },
  {
    addFavorite,
    removeFavorite,
    fetchFavorites,
    fetchPost,
    togglePin: () => () => console.error('Unhandled action'),
    removeReblog,
    openRepostDialog: params => openModal(SHOW_MODAL_REPOST, params),
  }
)(PostCard);
