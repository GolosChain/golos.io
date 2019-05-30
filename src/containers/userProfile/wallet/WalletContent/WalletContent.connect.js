/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import {
  getTransfersHistory,
  getVestingHistory,
  getBalance,
  getVestingBalance,
} from 'store/actions/gate';
import { TRANSACTIONS_TYPE } from 'shared/constants';
import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import WalletContent from './WalletContent';

export default connect(
  createSelector(
    [
      currentUserIdSelector,
      (state, props) => isOwnerSelector(props.userId)(state),
      (state, props) => dataSelector(['wallet', props.userId, 'transfers'])(state),
      (state, props) => entitySelector('users', props.userId)(state),
      (state, props) => dataSelector(['wallet', props.userId, 'vestingHistory'])(state),
      (state, props) => dataSelector(['wallet', props.userId, 'vestingSequenceKey'])(state),
      (state, props) => dataSelector(['wallet', props.userId, 'isVestingHistoryEnd'])(state),
    ],
    (
      loggedUserId,
      isOwner,
      transfers,
      user,
      vestingHistory,
      vestingSequenceKey,
      isVestingHistoryLoaded
    ) => {
      let mergedTransfers = [];
      let sent = [];
      let received = [];
      let vesting = [];

      if (transfers && (transfers.sent || transfers.received)) {
        sent = transfers.sent
          ? transfers.sent.map(({ sender, receiver, quantity, trx_id, timestamp, memo }) => ({
              id: trx_id,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
              memo,
            }))
          : [];

        received = transfers.received
          ? transfers.received.map(({ sender, receiver, quantity, trx_id, timestamp, memo }) => ({
              id: trx_id,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
              memo,
            }))
          : [];
      }

      if (vestingHistory && vestingHistory.length > 0) {
        vesting = vestingHistory.map(({ who, diff, trx_id, timestamp, memo }) => ({
          id: trx_id,
          type: TRANSACTIONS_TYPE.TRANSFER_TO_VESTING,
          from: parsePayoutAmount(diff) < 0 ? loggedUserId : who,
          to: parsePayoutAmount(diff) < 0 ? who : loggedUserId,
          amount: diff,
          timestamp,
          memo,
        }));
      }

      mergedTransfers = [...sent, ...received, ...vesting].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return {
        loggedUserId,
        transfers: mergedTransfers,
        isOwner,
        username: user ? user.username : '',
        vestingSequenceKey,
        isVestingHistoryLoaded,
      };
    }
  ),
  {
    getTransfersHistory,
    getVestingHistory,
    getBalance,
    getVestingBalance,
  }
)(WalletContent);
