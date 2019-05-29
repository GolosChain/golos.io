/* eslint-disable camelcase */
import { connect } from 'react-redux';

import { dataSelector, createDeepEqualSelector, entitySelector } from 'store/selectors/common';
import { currentUsernameSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { getTransfersHistory } from 'store/actions/gate';
import { TRANSACTIONS_TYPE } from 'shared/constants';

// import {
//   currentUserSelector,
//   pageAccountSelector,
//   globalSelector,
// } from 'store/selectors/auth';
// import transaction from 'app/redux/Transaction';
// import { openTransferDialog } from 'app/redux/actions/dialogs';
// import { setWalletTabState, setWalletTabsState } from 'app/redux/actions/ui';
// import { uiSelector } from 'store/selectors/auth';

import WalletContent from './WalletContent';

// export const getGlobalPropsSelector = globalSelector('props');

export default connect(
  createDeepEqualSelector(
    [
      currentUsernameSelector,
      (state, props) => isOwnerSelector(props.userId)(state),
      (state, props) => dataSelector(['wallet', props.userId, 'transfers'])(state),
      (state, props) => entitySelector('users', props.userId)(state),
    ],
    (currentUsername, isOwner, transfers, user) => {
      let mergedTransfers;

      if (transfers && (transfers.sent || transfers.received)) {
        const sent = transfers.sent
          ? transfers.sent.map(({ sender, receiver, quantity, trx_id, timestamp }, index) => ({
              id: trx_id || `${sender}to${receiver}#${index}at${new Date().toJSON()}`,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
            }))
          : [];

        const received = transfers.received
          ? transfers.received.map(({ sender, receiver, quantity, trx_id, timestamp }, index) => ({
              id: trx_id || `${receiver}from${sender}#${index}at${new Date().toJSON()}`,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: quantity,
              timestamp,
            }))
          : [];

        mergedTransfers = [...sent, ...received].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      }

      return {
        myAccountName: currentUsername,
        transfers: mergedTransfers,
        isOwner,
        username: user ? user.username : '',
      };
    }
  ),
  {
    getTransfersHistory,
  }
  // createSelector(
  //   [
  //     getGlobalPropsSelector,
  //     currentUserSelector,
  //     pageAccountSelector,
  //     uiSelector('wallet'),
  //     globalSelector('content'),
  //   ],
  //   (globalProps, myAccount, pageAccount, wallet, postsContent) => {
  //     const userId = pageAccount.name;
  //     const myAccountName = myAccount ? myAccount.get('username') : null;
  //     const walletTabsState = wallet.get('tabsState');
  //
  //     return {
  //       myAccount,
  //       myAccountName,
  //       pageAccount,
  //       userId,
  //       walletTabsState,
  //       isOwner: myAccountName && userId === myAccountName,
  //       globalProps,
  //       postsContent,
  //     };
  //   }
  // ),
  // () => ({})
  // dispatch => ({
  //   delegate: (operation, callback) =>
  //     dispatch(
  //       transaction.actions.broadcastOperation({
  //         type: 'delegate_vesting_shares',
  //         operation,
  //         successCallback() {
  //           callback(null);
  //         },
  //         errorCallback(err) {
  //           callback(err);
  //         },
  //       })
  //     ),
  //   loadRewards: (account, type) =>
  //     dispatch({
  //       type: 'FETCH_REWARDS',
  //       payload: {
  //         account,
  //         type,
  //       },
  //     }),
  //   getContent: payload =>
  //     new Promise((resolve, reject) => {
  //       dispatch({
  //         type: 'GET_CONTENT',
  //         payload: { ...payload, resolve, reject },
  //       });
  //     }),
  //   setWalletTabState: tab => {
  //     dispatch(setWalletTabState(tab));
  //   },
  //   setWalletTabsState: tabs => {
  //     dispatch(setWalletTabsState(tabs));
  //   },
  //   openTransferDialog: ({ to, amount, token, memo }) => {
  //     dispatch(
  //       openTransferDialog(to, {
  //         type: 'query',
  //         amount,
  //         token,
  //         memo,
  //       })
  //     );
  //   },
  // })
)(WalletContent);
