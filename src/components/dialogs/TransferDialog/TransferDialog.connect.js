import { connect } from 'react-redux';

import { currentUsernameSelector, currentUserIdSelector } from 'store/selectors/auth';
import { userLiquidBalanceSelector } from 'store/selectors/wallet';

import { transferToken } from 'store/actions/cyberway/cyberToken';
import TransferDialog from './TransferDialog';

export default connect(
  state => {
    const currentUsername = currentUsernameSelector(state);
    const userId = currentUserIdSelector(state);
    const balance = userLiquidBalanceSelector(userId)(state);

    return {
      currentUsername,
      balance,
    };
  },
  {
    transferToken,
  },
  null,
  { forwardRef: true }
)(TransferDialog);
