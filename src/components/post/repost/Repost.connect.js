import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'store/selectors/auth';

import Repost from './Repost';

export default connect(
  createSelector(
    [currentUsernameSelector, (state, props) => props.post.author],
    (username, author) => ({
      isOwner: username === author.account,
    })
  ),
  {
    openRepostDialog: () => () => console.error('Unhandled action'),
  }
)(Repost);
