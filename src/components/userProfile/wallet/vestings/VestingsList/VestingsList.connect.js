import { connect } from 'react-redux';

import { userWalletSelector } from 'store/selectors/wallet';
import { getVestingHistory } from 'store/actions/gate';
import VestingsList from './VestingsList';

export default connect(
  (state, { userId }) => {
    const vestings = userWalletSelector(userId, 'vestings')(state);

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
)(VestingsList);
