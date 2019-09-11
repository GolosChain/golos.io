import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import CommentAuthor from './CommentAuthor';

export default connect((state, props) => ({
  authorUsername: entitySelector('users', props.authorId)(state)?.username,
}))(CommentAuthor);
