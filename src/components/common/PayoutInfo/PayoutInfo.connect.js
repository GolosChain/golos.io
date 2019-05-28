import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { payoutSum } from 'utils/payout';
// import { getPayoutPermLink } from 'app/redux/selectors/payout/common';
// import { getHistoricalData } from 'app/redux/actions/rates';
import { entitySelector } from 'store/selectors/common';

import PayoutInfo from './PayoutInfo';

export default connect(
  // getPayoutPermLink,
  createSelector(
    [(state, props) => entitySelector('posts', props.postLink)(state)],
    post => ({
      post,
      totalPayout: payoutSum(post),
    })
  ),
  {
    // getHistoricalData: () => () => console.error('Unhandled action'),
  }
)(PayoutInfo);
