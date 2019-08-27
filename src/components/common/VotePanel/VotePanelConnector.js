import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import BigNum from 'bignumber.js';

import { dataSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { userVestingBalanceSelector } from 'store/selectors/wallet';
import { vote } from 'store/actions/complex/votes';
import { openVotersDialog } from 'store/actions/modals';
import { waitForTransaction, getVoters } from 'store/actions/gate';
import { payoutSum } from 'utils/payout';

export default connect(
  createSelector(
    [
      state => userVestingBalanceSelector(currentUserIdSelector(state))(state),
      dataSelector(['settings', 'basic', 'votePower']),
      (state, props) => payoutSum(props.entity.payout),
      dataSelector(['settings', 'basic', 'currency']),
      state =>
        dataSelector(['rates', dataSelector(['settings', 'basic', 'currency'])(state)])(state),
      dataSelector(['settings', 'basic', 'rounding']),
    ],
    (vesting, votePower, totalSum, currency = 'GOLOS', actualRate, payoutRounding) => {
      let payout = new BigNum(totalSum);

      // if (actualRate) {
      //   payout = payout.multipliedBy(actualRate);
      // }

      return {
        settingsVotePower: votePower,
        isRich: vesting.total > 10000,
        totalSum: payout,
        currency,
        payoutRounding,
      };
    }
  ),
  {
    vote,
    waitForTransaction,
    getVoters,
    openVotersDialog,
    loginIfNeed: () => () => console.error('Unhandled action'),
  }
);
