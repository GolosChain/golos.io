/* eslint-disable camelcase */
import tt from 'counterpart';

import { CYBERWAY_API } from 'store/middlewares/cyberway-api';
import {
  TRANSFER_TOKEN,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_ERROR,
  CLAIM_TOKEN,
  CLAIM_TOKEN_SUCCESS,
  CLAIM_TOKEN_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';
import { getBalance, getTransfersHistory, waitForWalletTransaction } from 'store/actions/gate';
import { displayError, displaySuccess } from 'utils/toastMessages';

const CONTRACT_NAME = 'cyberToken';

export const transferToken = (recipient, amount, symbol, memo) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    from: userId,
    to: recipient,
    quantity: `${amount} ${symbol}`,
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
      await dispatch(waitForWalletTransaction(processed.id));
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

export const claimToken = quantity => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    owner: userId,
    quantity,
  };

  try {
    const { processed } = await dispatch({
      [CYBERWAY_API]: {
        types: [CLAIM_TOKEN, CLAIM_TOKEN_SUCCESS, CLAIM_TOKEN_ERROR],
        contract: CONTRACT_NAME,
        method: 'claim',
        params: data,
      },
      meta: data,
    });

    if (processed?.id) {
      await dispatch(waitForWalletTransaction(processed.id));
      await Promise.all([
        dispatch(getBalance(userId)),
        dispatch(getTransfersHistory({ userId, direction: 'in' })),
      ]);
      displaySuccess(tt('wallet.success'));
    }
  } catch (err) {
    displayError(tt('g.error'), err);
  }
};
