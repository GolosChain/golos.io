import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_REPOST } from 'store/constants';
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
    openRepostDialog: params => openModal(SHOW_MODAL_REPOST, params),
  }
)(Repost);
