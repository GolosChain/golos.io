import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
import { fetchPostIfNeeded } from 'store/actions/gate';
import { formatContentId } from 'store/schemas/gate';
import RewardPostLink from './RewardPostLink';

export default connect(
  createSelector(
    [(state, props) => entitySelector('posts', formatContentId(props.contentId))(state)],
    post => ({
      post,
    })
  ),
  {
    fetchPostIfNeeded,
  }
)(RewardPostLink);
