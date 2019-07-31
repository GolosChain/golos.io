import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import { userVestingBalanceSelector } from 'store/selectors/wallet';
import { updateProfileMeta } from 'store/actions/cyberway/social';

import UserHeader from './UserHeader';

export default connect(
  createSelector(
    [(state, props) => userVestingBalanceSelector(props.profile.userId, 'GESTS')(state)],
    vesting => ({
      power: vesting.total,
    })
  ),
  {
    updateProfileMeta,
  }
)(UserHeader);
