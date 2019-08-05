import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserIdSelector } from 'store/selectors/auth';
import { userWithdrawStatusSelector } from 'store/selectors/wallet';
import { stopWithdrawTokens } from 'store/actions/cyberway/vesting';

import PowerDownLine from './PowerDownLine';

export default connect(
  createSelector(
    [
      (state, props) => userWithdrawStatusSelector(props.userId)(state),
      (state, props) => Boolean(props.userId === currentUserIdSelector(state)),
    ],
    (status, isOwner) => ({
      ...status,
      isOwner,
    })
  ),
  {
    stopWithdrawTokens,
  }
)(PowerDownLine);
