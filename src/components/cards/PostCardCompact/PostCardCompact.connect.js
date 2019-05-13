import { connect } from 'react-redux';

import { entitySelector, dataSelector } from 'store/selectors/common';
import { UIModeSelector } from 'store/selectors/ui';
import { nsfwTypeSelector } from 'store/selectors/settings';
import { fetchPost } from 'store/actions/gate';

import PostCardCompact from './PostCardCompact';

export default connect(
  (state, props) => {
    const post = entitySelector('posts', props.id)(state);
    const favoritePosts = dataSelector(['favorites', 'postsList'])(state) || [];
    const isFavorite = favoritePosts.some(favoritePost => favoritePost === props.id);

    const nsfwType = nsfwTypeSelector(state);
    let hideNsfw;
    let warnNsfw;
    if (post?.content?.tags?.includes('nsfw')) {
      hideNsfw = nsfwType === 'hide';
      warnNsfw = nsfwType === 'warn';
    }

    return {
      post,
      stats: {}, // TODO: Fix
      isMobile: UIModeSelector('screenType')(state) === 'mobile',
      isFavorite,
      hideNsfw,
      warnNsfw,
    };
  },
  {
    fetchPost,
    // eslint-disable-next-line no-console
    openRepostDialog: () => () => console.error('Unhandled action'),
  }
)(PostCardCompact);
