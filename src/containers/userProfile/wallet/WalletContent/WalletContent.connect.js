/* eslint-disable camelcase */
import { connect } from 'react-redux';

import { dataSelector, createDeepEqualSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { isOwnerSelector } from 'store/selectors/user';
import { getTransfersHistory, getVestingHistory } from 'store/actions/gate';
import { calculateAmount } from 'utils/wallet';
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
      currentUserIdSelector,
      (state, props) => isOwnerSelector(props.userId)(state),
      (state, props) => dataSelector(['wallet', props.userId, 'transfers'])(state),
      (state, props) => dataSelector(['wallet', props.userId, 'vestingHistory'])(state),
    ],
    (currentUserId, isOwner, transfers, vestingHistory = [1]) => {
      let mergedTransfers = [];
      let sent = [];
      let received = [];
      let vesting = [];

      if (transfers && (transfers.sent || transfers.received)) {
        sent = transfers.sent
          ? transfers.sent.map(({ sender, receiver, quantity, trx_id, timestamp }, index) => ({
              // TODO: replace with real id
              id: trx_id || `${sender}to${receiver}#${index}at${new Date().toJSON()}`,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: `${calculateAmount({
                amount: quantity.amount,
                decs: quantity.decs,
              })} ${quantity.sym}`,
              timestamp,
            }))
          : [];

        received = transfers.received
          ? transfers.received.map(({ sender, receiver, quantity, trx_id, timestamp }, index) => ({
              // TODO: replace with real id
              id: trx_id || `${receiver}from${sender}#${index}at${new Date().toJSON()}`,
              type: TRANSACTIONS_TYPE.TRANSFER,
              from: sender,
              to: receiver,
              amount: `${calculateAmount({
                amount: quantity.amount,
                decs: quantity.decs,
              })} ${quantity.sym}`,
              timestamp,
            }))
          : [];
      }
      const mockedVesting = [
        {
          who: 'testuser',
          diff: {
            amount: -3456368,
            decs: 6,
            sym: 'GOLOS',
          },
          block: 437889,
          trx_id: '9004079ce5bc1eaef48875b48be3bc2f75302465f769d1d1910b7ad83c2b9a04',
          timestamp: '2019-05-08T16:22:03.000Z',
        },
        {
          who: 'testuser',
          diff: {
            amount: 3456368,
            decs: 6,
            sym: 'GOLOS',
          },
          block: 437890,
          trx_id: 'ec17e372ee2cbe8c134a9bc1e9a0d73dd06a50b8aedea778756dada573bf95d6',
          timestamp: '2019-05-08T16:22:06.000Z',
        },
        {
          who: 'd5gqchmbgrdj',
          diff: {
            amount: 3456368,
            decs: 6,
            sym: 'GOLOS',
          },
          block: 438008,
          trx_id: 'd5728b644de2f35461095d1c67c478e35ed55e95aec045d8bed547567c3e6dcb',
          timestamp: '2019-05-08T16:28:00.000Z',
        },
      ];

      if (vestingHistory && vestingHistory.length > 0) {
        vesting = mockedVesting.map(({ who, diff, trx_id, timestamp }) => ({
          id: trx_id,
          type: TRANSACTIONS_TYPE.TRANSFER_TO_VESTING,
          from: diff.amount < 0 ? currentUserId : who,
          to: diff.amount < 0 ? who : currentUserId,
          amount: `${calculateAmount({
            amount: Math.abs(diff.amount),
            decs: diff.decs,
          })} ${diff.sym}`,
          timestamp,
        }));
      }

      mergedTransfers = [...sent, ...received, ...vesting].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return {
        myAccountName: currentUserId,
        transfers: mergedTransfers,
        isOwner,
      };
    }
  ),
  {
    getTransfersHistory,
    getVestingHistory,
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
