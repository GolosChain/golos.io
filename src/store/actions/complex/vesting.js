import cyber from 'cyber-client';

import {
  ACCEPT_VESTING_PROPOSAL,
  ACCEPT_VESTING_PROPOSAL_SUCCESS,
  ACCEPT_VESTING_PROPOSAL_ERROR,
} from 'store/constants';
import { CYBERWAY_API, CYBERWAY_RPC } from 'store/middlewares/cyberway-api';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUserIdSelector } from 'store/selectors/auth';
import { uint8ArrayToHex, hexToUint8Array } from 'utils/encoding';

export const delegateTokens = ({ recipient, amount, percent = 0 }) => async (
  dispatch,
  getState
) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    from: userId,
    to: recipient,
    quantity: `${parseFloat(amount).toFixed(6)} GOLOS`,
    interest_rate: Math.round(percent * 100),
  };

  const auth = [
    {
      actor: userId,
      permission: 'active',
    },
    {
      actor: recipient,
      permission: 'active',
    },
  ];

  const transaction = await dispatch({
    [CYBERWAY_API]: {
      contract: 'vesting',
      method: 'delegate',
      params: data,
      auth,
      options: {
        signByActors: [userId],
        provideBandwidthFor: [userId, recipient],
        broadcast: false,
        expireSeconds: 3600,
      },
    },
  });

  return dispatch({
    [CALL_GATE]: {
      method: 'bandwidth.createProposal',
      params: {
        transaction: {
          serializedTransaction: uint8ArrayToHex(transaction.serializedTransaction),
          signatures: transaction.signatures,
        },
        chainId: await cyber.api.getChainId(),
      },
    },
  });
};

export const acceptTokensDelegation = ({ proposalId, serializedTransaction }) => async (
  dispatch,
  getState
) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const pubKey = await getActivePublicKey(dispatch, userId);

  const { signatures } = await cyber.signatureProvider.sign({
    chainId: await cyber.api.getChainId(),
    requiredKeys: [pubKey],
    serializedTransaction: hexToUint8Array(serializedTransaction),
  });

  const params = {
    proposalId,
    signature: signatures[0],
  };

  return dispatch({
    [CALL_GATE]: {
      types: [
        ACCEPT_VESTING_PROPOSAL,
        ACCEPT_VESTING_PROPOSAL_SUCCESS,
        ACCEPT_VESTING_PROPOSAL_ERROR,
      ],
      method: 'bandwidth.signAndExecuteProposal',
      params,
    },
    meta: {
      proposalId,
      userId,
    },
  });
};

async function getActivePublicKey(dispatch, userId) {
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
}
