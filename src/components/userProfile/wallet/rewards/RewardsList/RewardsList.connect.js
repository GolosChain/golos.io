import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getRewardsHistory } from 'store/actions/gate';
import RewardsList from './RewardsList';

export default connect(
  (state, { type, userId }) => {
    const rewards = dataSelector(['wallet', 'users', userId, 'rewards', type])(state);
    return {
      isLoading: Boolean(rewards?.isLoading),
      items: rewards?.items || [],
      sequenceKey: rewards?.sequenceKey,
      isHistoryEnd: Boolean(rewards?.isHistoryEnd),
    };
  },
  {
    getRewardsHistory,
  }
)(RewardsList);
