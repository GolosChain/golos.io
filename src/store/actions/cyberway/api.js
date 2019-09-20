import { CYBERWAY_RPC } from 'store/middlewares/cyberway-api';

export const getAccountPublicKey = (userId, keyRole) => async dispatch => {
  if (!userId || !keyRole) {
    throw new Error('Invalid params');
  }

  const accountInfo = await dispatch({
    [CYBERWAY_RPC]: {
      method: 'get_account',
      params: userId,
    },
  });

  const perm = accountInfo.permissions.find(({ perm_name }) => perm_name === keyRole);

  if (perm) {
    try {
      const key = perm.required_auth.keys[0].key;

      if (key) {
        return key;
      }
    } catch {}
  }

  throw new Error(`No ${keyRole} key`);
};
