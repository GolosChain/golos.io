import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchPosts, getHashTagTop } from 'store/actions/gate';
import { entitiesSelector, statusSelector } from 'store/selectors/common';

import TagsCard from './TagsCard';

export default connect(
  createSelector(
    [entitiesSelector('tags'), statusSelector('tags')],
    (tags, { order, sequenceKey, isEnd }) => ({
      category: 'feed',
      order,
      sequenceKey,
      isEnd,
      tags,
      currentUsername: 'currentUsername',
    })
  ),
  {
    fetchPosts,
    getHashTagTop,
  }
)(TagsCard);
