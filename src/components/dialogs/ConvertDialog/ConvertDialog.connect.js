import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { fetchCurrentStateAction } from 'app/redux/actions/fetch';
// import { showNotification } from 'app/redux/actions/ui';
// import { powerDownSelector } from 'app/redux/selectors/wallet/powerDown';
// import { vestsToGolos } from 'utils/StateFunctions';
import { currentUserIdSelector, currentUsernameSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';
import { withdrawTokens, transferToken } from 'store/actions/cyberway';
import { calculateAmount } from 'utils/wallet';

import ConvertDialog from './ConvertDialog';

export default connect(
  createSelector(
    [
      currentUsernameSelector,
      state => dataSelector(['wallet', currentUserIdSelector(state), 'balances'])(state),
    ],
    (currentUsername, balances = []) => {
      const gls = balances.find(currency => currency.sym === 'GOLOS');

      let balance = 0;

      if (gls) {
        balance = Number(calculateAmount({ amount: gls.amount, decs: gls.decs }));
      }

      return {
        globalProps: {},
        currentUsername,
        myAccount: {},
        balance,
        powerBalance: 100,
      };
    }
  ),
  {
    transferToken,
    withdrawTokens,
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
