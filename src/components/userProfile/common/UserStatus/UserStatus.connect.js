import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { getUserStatus } from 'helpers/users';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import UserStatus from './UserStatus';

export default connect(
  createSelector(
    [(state, props) => dataSelector(['wallet', props.userId, 'vesting'])(state)],
    (vesting = 0) => {
      const power = parsePayoutAmount(vesting);

      return {
        userStatus: getUserStatus(power),
        power,
      };
    }
  )
)(UserStatus);
