import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { vote } from 'store/actions/complex/votes';
import { waitForTransaction, fetchPostVotes, fetchCommentVotes } from 'store/actions/gate';
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
        const gls = balances.find(currency => currency.sym === 'GOLOS');

        let balance = 0;

        if (gls) {
          balance = Number(calculateAmount({ amount: gls.amount, decs: gls.decs }));
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
    fetchPostVotes,
    fetchCommentVotes,
    openVotersDialog: () => () => console.error('Unhandled action'),
    loginIfNeed: () => () => console.error('Unhandled action'),
  }
);
