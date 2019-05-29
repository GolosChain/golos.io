import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { vote } from 'store/actions/complex/votes';
import { waitForTransaction, getVoters } from 'store/actions/gate';
import { calculateAmount } from 'utils/wallet';
import { payoutSum } from 'utils/payout';

export default connect(
  createSelector(
    [
      state => dataSelector(['wallet', currentUserIdSelector(state), 'balances'])(state),
      dataSelector(['settings', 'basic', 'votePower']),
      (state, props) => payoutSum(props.entity),
    ],
    (balances, votePower, totalSum) => {
      let isRich = false;

      if (balances) {
        // TODO: Replace gls by vesting
        const [gls] = balances;

        let balance = 0;

        if (gls) {
          balance = parseFloat(gls);
        }

        isRich = balance > 10000;
      }

      return {
        // TODO: Hardcoded true until wallet doesn't work correctly
        isRich: true,
        settingsVotePower: votePower,
        totalSum,
      };
    }
  ),
  {
    vote,
    waitForTransaction,
    getVoters,
    openVotersDialog: () => () => console.error('Unhandled action'),
    loginIfNeed: () => () => console.error('Unhandled action'),
  }
);
