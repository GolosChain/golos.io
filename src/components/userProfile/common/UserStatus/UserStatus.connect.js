import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { userVestingBalanceSelector } from 'store/selectors/wallet';
import { statusSelector } from 'store/selectors/common';
import { getBalance } from 'store/actions/gate';
import { getUserStatus } from 'helpers/users';

import UserStatus from './UserStatus';

export default connect(
  createSelector(
    [
      (state, props) => userVestingBalanceSelector(props.profile.userId, 'GESTS')(state),
      (state, props) => statusSelector(['wallet', props.profile.userId, 'isLoading'])(state),
    ],
    (vesting, isLoading) => {
      const power = vesting.total;

      return {
        userStatus: getUserStatus(power),
        power,
        isLoading,
      };
    }
  ),
  {
    getBalance,
  }
)(UserStatus);
