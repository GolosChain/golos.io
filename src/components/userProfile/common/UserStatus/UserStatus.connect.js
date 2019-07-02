import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { userVestingBalanceSelector } from 'store/selectors/wallet';
import { getUserStatus } from 'helpers/users';

import UserStatus from './UserStatus';

export default connect(
  createSelector(
    [(state, props) => userVestingBalanceSelector(props.profile.userId)(state)],
    vesting => {
      const power = vesting.total;

      return {
        userStatus: getUserStatus(power),
        power,
      };
    }
  )
)(UserStatus);
