/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { getTransfersHistory, getVestingHistory } from 'store/actions/gate';
import { TRANSACTIONS_TYPE } from 'shared/constants';

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
    ],
    (loggedUserId, isOwner, transfers, user, vestingHistory, vestingSequenceKey) => {
      let mergedTransfers = [];
      let sent = [];
      let received = [];
      let vesting = [];

      if (transfers && (transfers.sent || transfers.received)) {
        sent = transfers.sent
          ? transfers.sent.map(({ sender, receiver, quantity, trx_id, timestamp }) => ({
              id: trx_id,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
            }))
          : [];

        received = transfers.received
          ? transfers.received.map(({ sender, receiver, quantity, trx_id, timestamp }) => ({
              id: trx_id,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
            }))
          : [];
      }

      if (vestingHistory && vestingHistory.length > 0) {
        vesting = vestingHistory.map(({ who, diff, trx_id, timestamp }) => ({
          id: trx_id,
          type: TRANSACTIONS_TYPE.TRANSFER_TO_VESTING,
          from: diff.amount < 0 ? loggedUserId : who,
          to: diff.amount < 0 ? who : loggedUserId,
          amount: diff.amount,
          timestamp,
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
      };
    }
  ),
  {
    getTransfersHistory,
    getVestingHistory,
  }
)(WalletContent);
