import { connect } from 'react-redux';
import { createSelector } from 'reselect';

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
    ],
    (vesting, votePower, totalSum) => {
      let isRich = false;

      if (vesting && vesting.amount) {
        const balance = parsePayoutAmount(vesting.amount);
        isRich = balance > 10000;
      }

      return {
        settingsVotePower: votePower,
        isRich,
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
