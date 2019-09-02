import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { userCyberStakeBalanceSelector } from 'store/selectors/wallet';
import { delegateVote, recallvote } from 'store/actions/cyberway/stake';

import DelegateVoteDialog from './DelegateVoteDialog';

export default connect(
  (state, { stakedAmount }) => {
    const userId = currentUserIdSelector(state);

    let stakedBalance = 0;
    if (stakedAmount) {
      stakedBalance = parseFloat(stakedAmount);
    } else {
      stakedBalance = userCyberStakeBalanceSelector(userId, 'staked')(state);
    }

    return {
      stakedBalance,
    };
  },
  {
    delegateVote,
    recallvote,
  },
  null,
  { forwardRef: true }
)(DelegateVoteDialog);
