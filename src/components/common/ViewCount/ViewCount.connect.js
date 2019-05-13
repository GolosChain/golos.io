import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { fetchPostViewCount } from 'store/actions/gate/meta';

import ViewCount from './ViewCount';

export default connect(
  (state, props) => {
    const post = entitySelector('posts', props.contentUrl)(state);

    if (!post) {
      return {};
    }

    return {
      viewCount: post.meta.viewCount || 0,
    };
  },
  {
    fetchPostViewCount,
  }
)(ViewCount);
