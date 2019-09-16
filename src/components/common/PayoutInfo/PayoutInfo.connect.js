import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import BigNum from 'bignumber.js';

import { payoutSum } from 'utils/payout';

import { dataSelector, entitySelector } from 'store/selectors/common';

import PayoutInfo from './PayoutInfo';

export default connect(
  createSelector(
    [
      (state, props) => {
        const { type, id } = props.entity;

        if (type === 'comment') {
          let comment = entitySelector('replies', id)(state);

          if (!comment) {
            comment = entitySelector('postComments', id)(state);
          }

          if (!comment) {
            comment = entitySelector('profileComments', id)(state);
          }

          return comment;
        }

        return entitySelector('posts', id)(state);
      },
      dataSelector(['settings', 'basic', 'rounding']),
    ],
    ({ payout }, payoutRounding) => {
      const { done } = payout;
      const author = {
        value: new BigNum(payout.author.token.value)
          .plus(payout.author.vesting.value)
          .toFixed(payoutRounding),
        sym: payout.author.token.name,
      };
      const curator = {
        value: parseFloat(payout.curator.token.value).toFixed(payoutRounding),
        sym: payout.curator.token.name,
      };
      const benefactor = {
        value: parseFloat(payout.benefactor.token.value).toFixed(payoutRounding),
        sym: payout.benefactor.token.name,
      };
      const unclaimed = {
        value: parseFloat(payout.unclaimed.token.value).toFixed(payoutRounding),
        sym: payout.unclaimed.token.name,
      };

      return {
        author,
        curator,
        benefactor,
        unclaimed,
        done,
        totalPayout: parseFloat(payoutSum(payout)).toFixed(payoutRounding),
        payoutRounding,
      };
    }
  ),
  null
)(PayoutInfo);
