import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import ReplyBlock from './ReplyBlock';

export default connect((state, props) => ({
  author: entitySelector('users', props.post.author)(state),
}))(ReplyBlock);
