import { connect } from 'react-redux';

import { currentUsernameSelector, currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';

import { transferToken } from 'store/actions/cyberway/cyberToken';
import { calculateAmount } from 'utils/wallet';
import TransferDialog from './TransferDialog';

export default connect(
  state => {
    const currentUsername = currentUsernameSelector(state);
    const userId = currentUserIdSelector(state);
    const balances = dataSelector(['wallet', userId, 'balances'])(state) || [];
    const gls = balances.find(currency => currency.sym === 'GOLOS');

    let balance = 0;

    if (gls) {
      balance = Number(calculateAmount({ amount: gls.amount, decs: gls.decs }));
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
