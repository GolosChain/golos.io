import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getBalance } from 'store/actions/gate';
import { calculateAmount } from 'utils/wallet';

import AccountPrice from './AccountPrice';

export default connect(
  (state, props) => {
    const balances = dataSelector(['wallet', props.userId, 'balances'])(state) || [];
    const balance = balances.find(currency => currency.sym === 'GOLOS');
    let price;
    let currency = 'GOLOS';

    if (balance) {
      price = Number(calculateAmount({ amount: balance.amount, decs: balance.decs }));
      currency = balance.sym;
    }

    return {
      price,
      currency,
    };
  },
  {
    getBalance,
  }
)(AccountPrice);
