import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';

import AccountTokens from './AccountTokens';

export default connect(
  createSelector(
    [(state, props) => dataSelector(['wallet', props.userId, 'balances'])(state)],
    balances => {
      let gls;

      if (balances && balances.length) {
        gls = balances.find(value => value.endsWith(' GOLOS'));
      }

      return {
        golos: gls || '0',
        power: '0',
        powerDelegated: '0',
      };
    }
  )
)(AccountTokens);
