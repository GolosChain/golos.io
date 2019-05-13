import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { calculateAmount } from 'utils/wallet';

import AccountTokens from './AccountTokens';

export default connect(
  createSelector(
    [(state, props) => dataSelector(['wallet', props.userId, 'balances'])(state)],
    balances => {
      let points;
      let gls;

      if (balances && balances.length) {
        points = balances.map(balance => ({
          name: balance.sym,
          count: calculateAmount({ amount: balance.amount, decs: balance.decs }),
        }));
        gls = points.find(({ name }) => name === 'GOLOS');
      }

      return {
        golos: gls ? gls.count : '0',
        power: '0',
        powerDelegated: '0',
      };
    }
  )
)(AccountTokens);
