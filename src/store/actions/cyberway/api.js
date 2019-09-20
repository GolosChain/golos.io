import { CYBERWAY_RPC } from 'store/middlewares/cyberway-api';

export const getActivePublicKey = userId => async dispatch => {
  const accountInfo = await dispatch({
    [CYBERWAY_RPC]: {
      method: 'get_account',
      params: userId,
    },
  });

  const perm = accountInfo.permissions.find(({ perm_name }) => perm_name === 'active');

  if (!perm) {
    throw new Error('No active key');
  }

  try {
    return perm.required_auth.keys[0].key;
  } catch {
    throw new Error('No active key');
  }
};
