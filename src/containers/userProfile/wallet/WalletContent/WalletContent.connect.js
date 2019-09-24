import { connect } from 'react-redux';

import { profileSelector } from 'store/selectors/common';
import { currentUserIdSelector, isUnsafeAuthorized } from 'store/selectors/auth';
import { openTransferDialog } from 'store/actions/modals';

import WalletContent from './WalletContent';

export default connect(
  (state, props) => {
    const currentUserId = currentUserIdSelector(state);
    const profile = profileSelector(props.userId)(state);
    const isAuthorized = isUnsafeAuthorized(state);

    return {
      currentUserId,
      profile,
      isAuthorized,
    };
  },
  {
    openTransferDialog,
  }
)(WalletContent);
