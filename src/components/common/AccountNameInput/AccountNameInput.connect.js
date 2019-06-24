import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserSelector } from 'store/selectors/auth';
import AccountNameInput from './AccountNameInput';

export default connect(
  createSelector(
    [currentUserSelector],
    user => {
      return {
        following: '' /* follow.getIn(['getFollowingAsync', currentUsername, 'blog_result']) */,
        transferHistory: '' /* user.get('transfer_history') */,
      };
    }
  ),
  {
    // fetchTransferHistory: () => () => console.error('Unhandled action'),
  }
)(AccountNameInput);
