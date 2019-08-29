import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { userCyberStakeBalanceSelector } from 'store/selectors/wallet';
import { delegateVote } from 'store/actions/cyberway/stake';

import DelegateVoteDialog from './DelegateVoteDialog';

export default connect(
  state => {
    const userId = currentUserIdSelector(state);
    const stakedBalance = userCyberStakeBalanceSelector(userId, 'staked')(state);

    return {
      stakedBalance,
    };
  },
  {
    delegateVote,
  },
  null,
  { forwardRef: true }
)(DelegateVoteDialog);
