import { connect } from 'react-redux';

import { currentUsernameSelector, currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import { transferToken } from 'store/actions/cyberway/cyberToken';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';
import TransferDialog from './TransferDialog';

export default connect(
  state => {
    const currentUsername = currentUsernameSelector(state);
    const userId = currentUserIdSelector(state);
    const balances = dataSelector(['wallet', userId, 'balances'])(state) || [];
    const [gls] = balances;

    let balance = 0;

    if (gls) {
      balance = parsePayoutAmount(gls);
    }

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
