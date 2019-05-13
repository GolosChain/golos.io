import { connect } from 'react-redux';

import { statusSelector } from 'store/selectors/common';

import PostContainer from './PostContainer';

export default connect(state => ({
  error: statusSelector('post')(state).error,
}))(PostContainer);
