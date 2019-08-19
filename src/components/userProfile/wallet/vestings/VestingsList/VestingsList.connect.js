import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { dataSelector } from 'store/selectors/common';
import { getVestingHistory } from 'store/actions/gate';
import VestingsList from './VestingsList';

export default compose(
  withRouter,
  connect(
    (state, { userId }) => {
      const vestings = dataSelector(['wallet', 'users', userId, 'vestings'])(state);
      return {
        isLoading: Boolean(vestings?.isLoading),
        items: vestings?.items || [],
        sequenceKey: vestings?.sequenceKey,
        isHistoryEnd: Boolean(vestings?.isHistoryEnd),
      };
    },
    {
      getVestingHistory,
    }
  )
)(VestingsList);
