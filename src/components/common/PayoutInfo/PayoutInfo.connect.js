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
    [
      (state, props) => {
        const { type, id } = props.entity;

        if (type === 'comment') {
          return entitySelector('postComments', id)(state);
        }

        return entitySelector('posts', id)(state);
      },
    ],
    content => ({
      content,
      totalPayout: payoutSum(content),
    })
  ),
  {
    // getHistoricalData: () => () => console.error('Unhandled action'),
  }
)(PayoutInfo);
