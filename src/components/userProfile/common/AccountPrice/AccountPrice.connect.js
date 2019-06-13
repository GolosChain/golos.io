import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, statusSelector } from 'store/selectors/common';
import { getBalance, getVestingBalance } from 'store/actions/gate';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import AccountPrice from './AccountPrice';

export default connect(
  createSelector(
    [
      (state, props) => dataSelector(['wallet', props.userId, 'balances'])(state),
      (state, props) => dataSelector(['wallet', props.userId, 'vesting'])(state),
      dataSelector(['settings', 'basic', 'currency']),
      state =>
        dataSelector(['rates', dataSelector(['settings', 'basic', 'currency'])(state)])(state),
      statusSelector(['wallet', 'isLoading']),
    ],
    (balances = [], vesting, currency = 'GOLOS', actualRate, isLoading) => {
      const [balance] = balances;
      let price;

      if (balance) {
        const balanceAmount = parsePayoutAmount(balance);
        const vestingAmount =
          vesting && vesting.amount ? parsePayoutAmount(vesting.amount.GOLOS) : 0;
        // TODO: replace vestingAmount with calculated vesting to golos value
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
