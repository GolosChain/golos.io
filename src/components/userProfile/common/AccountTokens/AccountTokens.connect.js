import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';

import AccountTokens from './AccountTokens';

export default connect(
  createSelector(
    [
      (state, props) => dataSelector(['wallet', props.userId, 'balances'])(state),
      (state, props) => dataSelector(['wallet', props.userId, 'vesting'])(state),
    ],
    (balances, vesting) => {
      let gls;
      let power;
      let powerDelegated;

      if (balances && balances.length) {
        gls = balances.find(value => value.endsWith(' GOLOS'));
      }

      // if (vesting && vesting.amount) {
      //   power = calculateAmount({
      //     amount: vesting.amount.amount,
      //     decs: vesting.amount.decs,
      //   });
      // }

      // if (vesting && vesting.deligated) {
      //   powerDelegated = calculateAmount({
      //     amount: vesting.delegated.amount,
      //     decs: vesting.delegated.decs,
      //   });
      // }

      return {
        golos: gls || '0',
        power: power || '0',
        powerDelegated: powerDelegated || '0',
      };
    }
  )
)(AccountTokens);
