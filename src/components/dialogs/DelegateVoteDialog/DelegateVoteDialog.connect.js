import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { userLiquidBalanceSelector } from 'store/selectors/wallet';

import { delegateVote } from 'store/actions/cyberway/stake';
import DelegateVoteDialog from './DelegateVoteDialog';

export default connect(
  state => {
    const userId = currentUserIdSelector(state);
    const cyberBalance = userLiquidBalanceSelector(userId, 'CYBER')(state);

    return {
      cyberBalance,
    };
  },
  {
    delegateVote,
  },
  null,
  { forwardRef: true }
)(DelegateVoteDialog);
