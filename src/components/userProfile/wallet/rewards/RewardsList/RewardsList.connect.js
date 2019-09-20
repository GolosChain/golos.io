import { connect } from 'react-redux';

import { userWalletSelector } from 'store/selectors/wallet';
import { getRewardsHistory } from 'store/actions/gate';
import RewardsList from './RewardsList';

export default connect(
  (state, { type, userId }) => {
    const rewards = userWalletSelector(userId, ['rewards', type])(state);
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
