import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { getVestingHistory } from 'store/actions/gate';
import VestingsList from './VestingsList';

export default compose(
  withRouter,
  connect(
    createSelector(
      [
        (
          state,
          {
            router: {
              query: { userId },
            },
          }
        ) => dataSelector(['wallet', userId, 'vestings'])(state),
      ],
      vestings => {
        return {
          items: vestings?.items,
          sequenceKey: vestings?.sequenceKey,
          isHistoryEnd: vestings?.isHistoryEnd,
        };
      }
    ),
    {
      getVestingHistory,
    }
  )
)(VestingsList);
