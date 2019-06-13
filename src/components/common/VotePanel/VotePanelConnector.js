import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import BigNum from 'bignumber.js';

import { dataSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { vote } from 'store/actions/complex/votes';
import { waitForTransaction, getVoters } from 'store/actions/gate';
import { payoutSum } from 'utils/payout';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

export default connect(
  createSelector(
    [
      state => dataSelector(['wallet', currentUserIdSelector(state), 'vesting'])(state),
      dataSelector(['settings', 'basic', 'votePower']),
      (state, props) => payoutSum(props.entity),
      dataSelector(['settings', 'basic', 'currency']),
      state =>
        dataSelector(['rates', dataSelector(['settings', 'basic', 'currency'])(state)])(state),
      dataSelector(['settings', 'basic', 'rounding']),
    ],
    (vesting, votePower, totalSum, currency = 'GOLOS', actualRate, payoutRounding) => {
      let isRich = false;
      let payout = new BigNum(totalSum);

      if (vesting && vesting.amount) {
        const balance = parsePayoutAmount(vesting.amount);
        isRich = balance > 10000;
      }

      if (actualRate) {
        payout = payout.multipliedBy(actualRate);
      }

      return {
        settingsVotePower: votePower,
        isRich,
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
    openVotersDialog: () => () => console.error('Unhandled action'),
    loginIfNeed: () => () => console.error('Unhandled action'),
  }
);
