import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter } from 'next/router';

import { currentUserIdSelector } from 'store/selectors/auth';

import PostContent from './PostContent';

export default withRouter(
  connect(
    createSelector(
      [currentUserIdSelector, (state, props) => props.post],
      (username, post) => ({
        isAuthor: username === post.author,
        author: post.author,
      })
    )
  )(PostContent)
);
