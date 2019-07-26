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
    const cyberBalance = userLiquidBalanceSelector(userId, 'CYBER')(state);

    return {
      currentUsername,
      balance,
      cyberBalance,
    };
  },
  {
    transferToken,
  },
  null,
  { forwardRef: true }
)(TransferDialog);
