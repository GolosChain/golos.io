import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector } from 'store/selectors/common';
import { withdrawTokens, transferToken } from 'store/actions/cyberway';
import { getBalance, getVestingBalance } from 'store/actions/gate';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

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
        balance = parsePayoutAmount(gls);
      }

      if (vesting && vesting.amount) {
        powerBalance =
          parsePayoutAmount(vesting.amount.GOLOS) - parsePayoutAmount(vesting.delegated.GOLOS);
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
