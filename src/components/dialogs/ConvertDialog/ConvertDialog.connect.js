import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { fetchCurrentStateAction } from 'app/redux/actions/fetch';
// import { showNotification } from 'app/redux/actions/ui';
// import { powerDownSelector } from 'app/redux/selectors/wallet/powerDown';
// import { vestsToGolos } from 'utils/StateFunctions';
import { currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';
import { withdrawTokens, transferToken } from 'store/actions/cyberway';
import { calculateAmount } from 'utils/wallet';
import { getBalance, getVestingBalance } from 'store/actions/gate';

import ConvertDialog from './ConvertDialog';

export default connect(
  createSelector(
    [
      currentUserIdSelector,
      state => dataSelector(['wallet', currentUserIdSelector(state), 'balances'])(state),
      state => dataSelector(['wallet', currentUserIdSelector(state), 'vesting'])(state),
    ],
    (currentUserId, balances = [], vesting) => {
      let balance = 0;
      let powerBalance = 0;

      if (balances.length) {
        const [gls] = balances;
        balance = parseFloat(gls);
      }

      if (vesting && vesting.amount) {
        powerBalance = Number(
          calculateAmount({ amount: vesting.amount.amount, decs: vesting.amount.decs })
        );
      }

      return {
        globalProps: {},
        currentUserId,
        myAccount: {},
        balance,
        powerBalance,
      };
    }
  ),
  {
    transferToken,
    withdrawTokens,
    getBalance,
    getVestingBalance,
  },
  null,
  { forwardRef: true }
)(ConvertDialog);

/* function getVesting(account, props) {
  const vesting = parseFloat(account.vesting_shares);
  const delegated = parseFloat(account.delegated_vesting_shares);

  const availableVesting = vesting - delegated;

  return {
    golos: vestsToGolos(`${availableVesting.toFixed(6)} GESTS`, props),
  };
} */
