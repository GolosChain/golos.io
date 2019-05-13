import cyber from 'cyber-client';

import { logout } from 'store/actions/gate/auth';
import { CYBERWAY_API, CYBERWAY_RPC } from 'store/middlewares/cyberway-api';

import {
  UPDATE_AUTH,
  UPDATE_AUTH_SUCCESS,
  UPDATE_AUTH_ERROR,
  FETCH_ACCOUNT,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_ERROR,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';

const PARENT_PERMISSION = {
  posting: 'active',
  active: 'owner',
  owner: '',
};

export const fetchAccountPermissions = () => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return dispatch({
    [CYBERWAY_RPC]: {
      types: [FETCH_ACCOUNT, FETCH_ACCOUNT_SUCCESS, FETCH_ACCOUNT_ERROR],
      method: 'get_account',
      params: userId,
      meta: { userId },
    },
  });
};

export const changePassword = (password, publicKeys, availableRoles) => async (
  dispatch,
  getState
) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }
  const updateAuthActions = availableRoles.map(role =>
    cyber.basic.prepareAction(
      'cyber',
      'updateauth',
      { accountName: userId, permission: 'owner' },
      {
        account: userId,
        permission: role,
        parent: PARENT_PERMISSION[role],
        auth: {
          threshold: 1,
          keys: [
            {
              weight: 1,
              key: publicKeys[role],
            },
          ],
          accounts: [],
          waits: [],
        },
      }
    )
  );

  const keys = cyber.getActualAuth(userId, password, 'owner');

  cyber.initProvider(keys.actualKey);

  dispatch({
    [CYBERWAY_API]: {
      types: [UPDATE_AUTH, UPDATE_AUTH_SUCCESS, UPDATE_AUTH_ERROR],
      contract: 'basic',
      method: 'sendActions',
      params: updateAuthActions,
    },
  });

  dispatch(logout());
};
