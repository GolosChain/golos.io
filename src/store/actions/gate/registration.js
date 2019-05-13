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
import { createPdf, generateKeys, stepToScreenId } from 'components/modals/SignUp/utils';
import { login } from './auth';
import { openWallet } from '../cyberway/vesting';

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
          captcha: '',
          mail: ' ',
          testingPass: 'machtfrei',
          phone: phoneNumber,
        },
      },
    });
  } catch ({ message, currentState }) {
    if (message.split(': ')[1] === PHONE_ALREADY_REGISTERED) {
      dispatch(setFirstStepError('Phone has been already registered'));
      throw message;
    }
    if (message.split(': ')[1] === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    dispatch(setFirstStepError('Unknown error.'));
    throw message;
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
  } catch ({ message, currentState }) {
    if (message.split(': ')[1] === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw message;
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
  } catch ({ message, currentState }) {
    if (message.split(': ')[1] === INVALID_STEP_TAKEN) {
      return stepToScreenId(currentState);
    }
    throw message;
  }
};

export const fetchToBlockChain = () => async (dispatch, getState) => {
  const regData = regDataSelector(getState());
  const user = regData.wishUsername;
  const phoneNumber = regData.fullPhoneNumber;

  if (regData.isRegFinished) {
    return;
  }

  dispatch({
    type: START_REG_BLOCK_CHAIN,
  });

  if (!regData.keys.masterPrivateKey) {
    const master = await generateKeys();

    dispatch({
      type: SET_USERS_KEYS,
      payload: { keys: master },
    });
  }

  const { keys } = regDataSelector(getState());

  try {
    await dispatch({
      [CALL_GATE]: {
        types: [FETCH_REG_BLOCK_CHAIN, FETCH_REG_BLOCK_CHAIN_SUCCESS, FETCH_REG_BLOCK_CHAIN_ERROR],
        method: 'registration.toBlockChain',
        params: {
          user,
          owner: keys.publicKeys.owner,
          active: keys.publicKeys.active,
          posting: ' ',
          memo: ' ',
        },
      },
    });

    setRegistrationData({ isRegFinished: true });
  } catch ({ message, currentState }) {
    if (message.split(': ')[1] === INVALID_STEP_TAKEN) {
      stepToScreenId(currentState);
    }
    throw message;
  }

  createPdf(keys, user, phoneNumber);

  // TODO uncomment after delay will be fined on backend
  // await dispatch(openWallet(user));

  const password = keys.privateKeys.active;
  const auth = await dispatch(login(user, password));
  if (auth) {
    saveAuth(user, password);
  }
};

export const blockChainStopLoader = () => ({
  type: BLOCK_CHAIN_STOP_LOADER,
});
