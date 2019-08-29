import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { blockUser, unblockUser } from 'store/actions/cyberway/social';
import { showLoginOldDialog } from '/store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { currentUsernameSelector } from 'store/selectors/auth';

import BlockUserButton from './BlockUserButton';

export default connect(
  createSelector(
    [statusSelector('user'), currentUsernameSelector],
    (userStatus, currentUsername) => ({
      isLoading: userStatus.isLoadingBlock,
      currentUsername,
      isBlocked: false,
    })
  ),
  {
    blockUser,
    unblockUser,
    showLoginOldDialog,
  }
)(BlockUserButton);
