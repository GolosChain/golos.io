import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import ReplyBlock from './ReplyBlock';

export default connect((state, props) => {
  return {
    author: props.postContentId ? entitySelector('users', props.postContentId.userId)(state) : null,
  };
})(ReplyBlock);
