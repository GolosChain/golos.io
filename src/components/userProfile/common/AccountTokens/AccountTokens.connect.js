import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import AccountTokens from './AccountTokens';

export default connect(
  createSelector(
    [
      (state, props) => dataSelector(['wallet', props.userId, 'balances'])(state),
      (state, props) => dataSelector(['wallet', props.userId, 'vesting'])(state),
    ],
    (balances, vesting) => {
      let gls = 0;
      let power;
      let powerDelegated;

      if (balances && balances.length) {
        [gls] = balances;
      }

      if (vesting && vesting.amount) {
        power = parsePayoutAmount(vesting.amount);
      }

      if (vesting && vesting.deligated) {
        powerDelegated = parsePayoutAmount(vesting.delegated);
      }

      return {
        golos: parsePayoutAmount(gls) || '0',
        power: power || '0',
        powerDelegated: powerDelegated || '0',
      };
    }
  )
)(AccountTokens);
