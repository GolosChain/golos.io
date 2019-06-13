import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import { parsePayoutAmount } from 'utils/ParsersAndFormatters';
import { dataSelector } from 'store/selectors/common';
import { updateProfileMeta } from 'store/actions/cyberway/social';

import UserHeader from './UserHeader';

export default connect(
  createSelector(
    [(state, props) => dataSelector(['wallet', props.profile.userId, 'vesting'])(state)],
    vesting => {
      let power = 0;

      if (vesting && vesting.amount) {
        const delegated = parsePayoutAmount(vesting.delegated.GOLOS) || 0;
        const amount = parsePayoutAmount(vesting.amount.GOLOS) || 0;
        power = amount - delegated;
      }

      return {
        power,
      };
    }
  ),
  {
    updateProfileMeta,
  }
)(UserHeader);
