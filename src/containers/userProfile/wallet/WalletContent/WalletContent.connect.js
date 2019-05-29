/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, entitySelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { getTransfersHistory } from 'store/actions/gate';
import { TRANSACTIONS_TYPE } from 'shared/constants';

import WalletContent from './WalletContent';

export default connect(
  createSelector(
    [
      currentUserIdSelector,
      (state, props) => isOwnerSelector(props.userId)(state),
      (state, props) => dataSelector(['wallet', props.userId, 'transfers'])(state),
      (state, props) => entitySelector('users', props.userId)(state),
    ],
    (loggedUserId, isOwner, transfers, user) => {
      let mergedTransfers;

      if (transfers && (transfers.sent || transfers.received)) {
        const sent = transfers.sent
          ? transfers.sent.map(({ sender, receiver, quantity, trx_id, timestamp }) => ({
              id: trx_id,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
            }))
          : [];

        const received = transfers.received
          ? transfers.received.map(({ sender, receiver, quantity, trx_id, timestamp }) => ({
              id: trx_id,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
            }))
          : [];

        mergedTransfers = [...sent, ...received].sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        );
      }

      return {
        loggedUserId,
        transfers: mergedTransfers,
        isOwner,
        username: user ? user.username : '',
      };
    }
  ),
  {
    getTransfersHistory,
  }
)(WalletContent);
