import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { getRewardsHistory } from 'store/actions/gate';
import RewardsList from './RewardsList';

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
            type,
          }
        ) => dataSelector(['wallet', userId, 'rewards', type])(state),
      ],
      rewards => {
        return {
          isLoading: rewards?.isLoading,
          items: rewards?.items,
          sequenceKey: rewards?.sequenceKey,
          isHistoryEnd: rewards?.isHistoryEnd,
        };
      }
    ),
    {
      getRewardsHistory,
    }
  )
)(RewardsList);
