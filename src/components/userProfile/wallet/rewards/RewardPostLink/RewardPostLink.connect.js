import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { fetchPostIfNeeded } from 'store/actions/gate';
import { formatContentId } from 'store/schemas/gate';
import RewardPostLink from './RewardPostLink';

export default connect(
  (state, props) => ({
    post: entitySelector('posts', formatContentId(props.contentId))(state),
  }),
  {
    fetchPostIfNeeded,
  }
)(RewardPostLink);
