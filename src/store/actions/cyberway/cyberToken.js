/* eslint-disable camelcase */
import tt from 'counterpart';

import { CYBERWAY_API } from 'store/middlewares/cyberway-api';
import {
  TRANSFER_TOKEN,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';
import { getBalance, getTransfersHistory, waitForWalletTransaction } from 'store/actions/gate';
import { displayError, displaySuccess } from 'utils/toastMessages';
import { GOLOS_CURRENCY_ID } from 'shared/constants';

const CONTRACT_NAME = 'cyberToken';

// eslint-disable-next-line
export const transferToken = (recipient, tokens, memo) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    from: userId,
    to: recipient,
    quantity: `${tokens} ${GOLOS_CURRENCY_ID}`,
    memo: memo || '',
  };

  try {
    const { processed } = await dispatch({
      [CYBERWAY_API]: {
        types: [TRANSFER_TOKEN, TRANSFER_TOKEN_SUCCESS, TRANSFER_TOKEN_ERROR],
        contract: CONTRACT_NAME,
        method: 'transfer',
        params: data,
      },
      meta: data,
    });

    if (processed?.id) {
      await waitForWalletTransaction(processed.id);
      await Promise.all([
        dispatch(getBalance(userId)),
        dispatch(getTransfersHistory({ userId, direction: 'out' })),
      ]);
      displaySuccess(tt('dialogs_transfer.transfer.transfer_success'));
    }
  } catch (err) {
    displayError(tt('dialogs_transfer.transfer.transfer_failed'), err);
  }
};
