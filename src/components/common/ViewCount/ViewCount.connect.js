import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import ViewCount from './ViewCount';

export default connect((state, props) => {
  const post = entitySelector('posts', props.contentUrl)(state);

  return {
    viewCount: post?.stats?.viewCount,
  };
})(ViewCount);
