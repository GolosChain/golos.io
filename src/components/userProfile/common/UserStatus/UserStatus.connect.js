import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { getUserStatus } from 'helpers/users';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import UserStatus from './UserStatus';

export default connect(
  createSelector(
    [(state, props) => dataSelector(['wallet', props.profile.userId, 'vesting'])(state)],
    vesting => {
      let power = 0;

      if (vesting && vesting.amount) {
        const delegated = parsePayoutAmount(vesting.delegated) || 0;
        const amount = parsePayoutAmount(vesting.amount) || 0;
        power = amount - delegated;
      }

      return {
        userStatus: getUserStatus(power),
        power,
      };
    }
  )
)(UserStatus);
