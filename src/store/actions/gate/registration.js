import { isEmpty } from 'ramda';
import { generateKeys } from 'cyber-client/lib/auth';

import {
  FETCH_REG_FIRST_STEP,
  FETCH_REG_FIRST_STEP_SUCCESS,
  FETCH_REG_FIRST_STEP_ERROR,
  SET_FIRST_STEP_ERROR,
  FIRST_STEP_STOP_LOADER,
  SET_FULL_PHONE_NUMBER,
  FETCH_REG_VERIFY,
  FETCH_REG_VERIFY_SUCCESS,
  FETCH_REG_VERIFY_ERROR,
  FETCH_REG_SET_USER,
  FETCH_REG_SET_USER_SUCCESS,
  FETCH_REG_SET_USER_ERROR,
  FETCH_REG_BLOCK_CHAIN,
  FETCH_REG_BLOCK_CHAIN_SUCCESS,
  FETCH_REG_BLOCK_CHAIN_ERROR,
  SET_USERS_KEYS,
  START_REG_BLOCK_CHAIN,
  FETCH_RESEND_SMS,
  FETCH_RESEND_SMS_SUCCESS,
  FETCH_RESEND_SMS_ERROR,
  BLOCK_CHAIN_STOP_LOADER,
} from 'store/constants/actionTypes';

import { regDataSelector, fullNumberSelector } from 'store/selectors/registration';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { saveAuth, setRegistrationData } from 'utils/localStorage';
import { createPdf, stepToScreenId } from 'components/modals/SignUp/utils';
import { login } from './auth';

const INVALID_STEP_TAKEN = 'Invalid step taken';
const PHONE_ALREADY_REGISTERED = 'Phone already registered.';

export const fetchResendSms = phone => async dispatch =>
  dispatch({
    [CALL_GATE]: {
      types: [FETCH_RESEND_SMS, FETCH_RESEND_SMS_SUCCESS, FETCH_RESEND_SMS_ERROR],
      method: 'registration.resendSmsCode',
      params: {
        phone,
      },
    },
  });

const setFirstStepError = err => ({
  type: SET_FIRST_STEP_ERROR,
  payload: { err },
});

// eslint-disable-next-line consistent-return
export const fetchRegFirstStep = phoneNumber => async dispatch => {
  dispatch({
    type: SET_FULL_PHONE_NUMBER,
    payload: { fullPhoneNumber: phoneNumber },
  });
  setRegistrationData({ fullPhoneNumber: phoneNumber });
  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_FIRST_STEP, FETCH_REG_FIRST_STEP_SUCCESS, FETCH_REG_FIRST_STEP_ERROR],
        method: 'registration.firstStep',
        params: {
          phone: phoneNumber,
        },
      },
    });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === PHONE_ALREADY_REGISTERED || currentState === 'registered') {
      dispatch(setFirstStepError('Phone has been already registered'));
      throw originalMessage;
    }
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    dispatch(setFirstStepError('Unknown error.'));
    throw originalMessage;
  }
};

export const firstStepStopLoader = () => ({
  type: FIRST_STEP_STOP_LOADER,
});

// eslint-disable-next-line consistent-return
export const fetchRegVerify = code => async (dispatch, getState) => {
  const phone = fullNumberSelector(getState());

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_VERIFY, FETCH_REG_VERIFY_SUCCESS, FETCH_REG_VERIFY_ERROR],
        method: 'registration.verify',
        params: {
          phone,
          code,
        },
      },
    });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw originalMessage;
  }
};

// eslint-disable-next-line consistent-return
export const fetchSetUser = username => async (dispatch, getState) => {
  const phone = fullNumberSelector(getState());

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_SET_USER, FETCH_REG_SET_USER_SUCCESS, FETCH_REG_SET_USER_ERROR],
        method: 'registration.setUsername',
        params: {
          user: username,
          phone,
        },
      },
    });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw originalMessage;
  }
};

export const fetchToBlockChain = () => async (dispatch, getState) => {
  const regData = regDataSelector(getState());
  const user = regData.wishUsername;
  const phoneNumber = regData.fullPhoneNumber;

  if (regData.isRegFinished) {
    return null;
  }

  dispatch({
    type: START_REG_BLOCK_CHAIN,
  });

  if (isEmpty(regData.keys)) {
    const generatedKeys = await generateKeys(user);

    dispatch({
      type: SET_USERS_KEYS,
      payload: { keys: generatedKeys },
    });
  }

  const { keys } = regDataSelector(getState());
  let result;

  try {
    result = await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_BLOCK_CHAIN, FETCH_REG_BLOCK_CHAIN_SUCCESS, FETCH_REG_BLOCK_CHAIN_ERROR],
        method: 'registration.toBlockChain',
        params: {
          user,
          owner: keys.owner.publicKey,
          active: keys.active.publicKey,
          posting: keys.posting.publicKey,
          // TODO
          memo: ' ',
        },
      },
    });

    setRegistrationData({ isRegFinished: true });
  } catch ({ originalMessage, currentState }) {
    if (originalMessage === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw originalMessage;
  }

  const { userId, username } = result;

  createPdf(keys, {
    userId,
    username,
    phoneNumber,
  });

  const password = keys.active.privateKey;
  const auth = await dispatch(login(userId, password));

  if (auth) {
    saveAuth(userId, password);
  }
};

export const blockChainStopLoader = () => ({
  type: BLOCK_CHAIN_STOP_LOADER,
});
