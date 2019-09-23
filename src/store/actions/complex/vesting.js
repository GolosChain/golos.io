import cyber from 'cyber-client';

import {
  ACCEPT_VESTING_PROPOSAL,
  ACCEPT_VESTING_PROPOSAL_SUCCESS,
  ACCEPT_VESTING_PROPOSAL_ERROR,
} from 'store/constants';
import { CYBERWAY_API } from 'store/middlewares/cyberway-api';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { currentUserIdSelector } from 'store/selectors/auth';
import { uint8ArrayToHex, hexToUint8Array } from 'utils/encoding';
import { getAccountPublicKey } from 'store/actions/cyberway';

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
        chainId: '591c8aa5cade588b1ce045d26e5f2a162c52486262bd2d7abcb7fa18247e17ec', // TODO: await cyber.api.getChainId(),
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

  const pubKey = await dispatch(getAccountPublicKey(userId, 'active'));

  const { signatures } = await cyber.signatureProvider.sign({
    chainId: '591c8aa5cade588b1ce045d26e5f2a162c52486262bd2d7abcb7fa18247e17ec', // TODO: await cyber.api.getChainId(),
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
