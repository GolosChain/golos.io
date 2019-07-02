/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { getTransfersHistory, getVestingHistory, getBalance } from 'store/actions/gate';
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
      let sentSequenceKey = null;
      let receivedSequenceKey = null;
      let isSentHistoryLoaded = false;
      let isReceivedHistoryLoaded = false;

      if (transfers && (transfers.sent || transfers.received)) {
        if (transfers.sent) {
          sent =
            transfers.sent.items.map(({ sender, receiver, quantity, trx_id, timestamp, memo }) => ({
              id: trx_id,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
              memo,
            })) || [];

          sentSequenceKey = transfers.sent.sequenceKey || null;
          isSentHistoryLoaded = transfers.sent.isHistoryEnd || false;
        }

        if (transfers.received) {
          received =
            transfers.received.items.map(
              ({ sender, receiver, quantity, trx_id, timestamp, memo }) => ({
                id: trx_id,
                type: TRANSACTIONS_TYPE.TRANSFER,
                from: sender,
                to: receiver,
                amount: quantity,
                timestamp,
                memo,
              })
            ) || [];

          receivedSequenceKey = transfers.received.sequenceKey || null;
          isReceivedHistoryLoaded = transfers.received.isHistoryEnd || false;
        }
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
        sentSequenceKey,
        receivedSequenceKey,
        isSentHistoryLoaded,
        isReceivedHistoryLoaded,
      };
    }
  ),
  {
    getTransfersHistory,
    getVestingHistory,
    getBalance,
  }
)(WalletContent);
