import { connect } from 'react-redux';
import { createSelector } from 'reselect/lib/index';

import { currentUserSelector, isUnsafeAuthorized } from 'store/selectors/auth';
import { entitySelector, statusSelector } from 'store/selectors/common';
import { recordPostView } from 'store/actions/gate/meta';
import { formatContentId } from 'store/schemas/gate';
// import { locationTagsSelector } from 'app/redux/selectors/app/location';
// import { currentPostSelector, authorSelector } from 'app/redux/selectors/post/commonPost';
// import { togglePin } from 'app/redux/actions/pinnedPosts';
// import { toggleFavorite } from 'app/redux/actions/favorites';
// import { isHide } from 'utils/StateFunctions';
// import { HIDE_BY_TAGS } from 'constants/tags';

import Post from './Post';

export default connect(
  createSelector(
    [
      currentUserSelector,
      isUnsafeAuthorized,
      statusSelector('postComments'),
      (state, props) => entitySelector('posts', formatContentId(props.contentId))(state),
    ],
    (user, isAuthorized, { isLoading }, post) => {
      return {
        user,
        post,
        isAuthorized,
        isCommentsLoading: isLoading,
        // author: author.account,
        // postLoaded: Boolean(post),
        // isPinned: author.pinnedPostsUrls.includes(`${author.account}/${post.permLink}`),
        // permLink: post.permLink,
        // isFavorite: post.isFavorite,
        // isOwner: username === author.account,
        // stats: post.stats,
        // isHidden:
        //   isHide(post) ||
        //   post.isEmpty ||
        //   (username !== author.account && isContainTags(post, HIDE_BY_TAGS) && !tagsSelect.length),
        // user,
      };
    }
  ),
  {
    recordPostView,
  }
)(Post);
