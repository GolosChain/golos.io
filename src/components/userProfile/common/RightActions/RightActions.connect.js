import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { openTransferDialog, openDelegateDialog, openConvertDialog } from 'store/actions/modals';

import RightActions from './RightActions';

export default connect(
  (state, props) => {
    const loggedUserId = currentUserIdSelector(state);

    return {
      loggedUserId,
      isOwner: props.userId === loggedUserId,
    };
  },
  {
    openTransferDialog,
    openDelegateDialog,
    openConvertDialog,
  }
)(RightActions);
