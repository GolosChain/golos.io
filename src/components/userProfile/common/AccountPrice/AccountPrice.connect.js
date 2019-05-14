import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, statusSelector } from 'store/selectors/common';
import { getBalance, getVestingBalance } from 'store/actions/gate';
import { calculateAmount } from 'utils/wallet';

import AccountPrice from './AccountPrice';

export default connect(
  createSelector(
    [
      (state, props) => dataSelector(['wallet', props.userId, 'balances'])(state),
      (state, props) => dataSelector(['wallet', props.userId, 'vesting'])(state),
      dataSelector(['settings', 'basic', 'currency']),
      dataSelector(['rates', dataSelector(['settings', 'basic', 'currency'])]),
      statusSelector(['wallet', 'isLoading']),
    ],
    (balances = [], vesting, currency = 'GOLOS', actualRate, isLoading) => {
      const [balance] = balances;
      let price;

      if (balance) {
        const balanceAmount = Number(
          calculateAmount({ amount: balance.amount, decs: balance.decs })
        );
        const vestingAmount = vesting
          ? Number(
              calculateAmount({
                amount: vesting.amount.amount,
                decs: vesting.amount.decs,
              })
            )
          : 0;
        price = balanceAmount + vestingAmount;
      }

      if (actualRate) {
        price *= actualRate;
      }

      return {
        price,
        currency: actualRate ? currency : 'GOLOS',
        isLoading,
      };
    }
  ),
  {
    getBalance,
    getVestingBalance,
  }
)(AccountPrice);
