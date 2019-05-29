import {
  FETCH_REG_FIRST_STEP,
  FETCH_REG_FIRST_STEP_SUCCESS,
  SET_FIRST_STEP_ERROR,
  FIRST_STEP_STOP_LOADER,
  FETCH_REG_VERIFY,
  FETCH_REG_VERIFY_SUCCESS,
  FETCH_REG_VERIFY_ERROR,
  CLEAR_VERIFY_ERROR,
  FETCH_REG_SET_USER,
  FETCH_REG_SET_USER_SUCCESS,
  FETCH_REG_SET_USER_ERROR,
  START_REG_BLOCK_CHAIN,
  FETCH_REG_BLOCK_CHAIN_ERROR,
  BLOCK_CHAIN_STOP_LOADER,
  CLEAR_REG_ERRORS,
  FETCH_RESEND_SMS,
  FETCH_RESEND_SMS_ERROR,
  FETCH_RESEND_SMS_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  isLoadingFirstStep: false,
  sendPhoneError: '',
  isLoadingVerify: false,
  sendVerifyError: '',
  isResendSmsLoading: false,
  resendSmsError: '',
  isLoadingSetUser: false,
  sendUserError: '',
  isLoadingBlockChain: false,
  blockChainError: '',
  nextSmsRetry: 0,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case FETCH_REG_FIRST_STEP:
      return {
        ...state,
        sendPhoneError: '',
        isLoadingFirstStep: true,
      };

    case FETCH_REG_FIRST_STEP_SUCCESS:
      return {
        ...state,
        nextSmsRetry: new Date(payload.nextSmsRetry).getTime(),
        isLoadingFirstStep: false,
      };

    case SET_FIRST_STEP_ERROR:
      return {
        ...state,
        sendPhoneError: payload.err,
      };

    case FIRST_STEP_STOP_LOADER:
      return {
        ...state,
        isLoadingFirstStep: false,
      };

    case FETCH_REG_VERIFY:
      return {
        ...state,
        sendVerifyError: '',
        isLoadingVerify: true,
      };

    case FETCH_REG_VERIFY_SUCCESS:
      return {
        ...state,
        isLoadingVerify: false,
      };

    case FETCH_REG_VERIFY_ERROR:
      let sendVerifyError = '';
      if (error.code === 403) {
        sendVerifyError = 'Invalid confirmation code.';
      } else {
        sendVerifyError = 'Unknown error.';
      }

      return {
        ...state,
        sendVerifyError,
        isLoadingVerify: false,
      };

    case CLEAR_VERIFY_ERROR:
      return {
        ...state,
        sendVerifyError: '',
      };

    case FETCH_RESEND_SMS:
      return {
        ...state,
        isResendSmsLoading: true,
      };

    case FETCH_RESEND_SMS_SUCCESS:
      return {
        ...state,
        nextSmsRetry: new Date(payload.nextSmsRetry).getTime(),
        resendSmsError: '',
        isResendSmsLoading: false,
      };

    case FETCH_RESEND_SMS_ERROR:
      let resendSmsError = '';
      switch (error.message) {
        case 'Too many retry.':
          resendSmsError = 'Too many retries, try later.';
          break;
        case 'Try later.':
          resendSmsError = 'Try send a little later.';
          break;
        default:
          resendSmsError = 'Unknown error.';
      }

      return {
        ...state,
        resendSmsError,
        isResendSmsLoading: false,
      };

    case FETCH_REG_SET_USER:
      return {
        ...state,
        sendUserError: '',
        isLoadingSetUser: true,
      };

    case FETCH_REG_SET_USER_SUCCESS:
      return {
        ...state,
        isLoadingSetUser: false,
      };

    case FETCH_REG_SET_USER_ERROR:
      let sendUserError = '';
      if (error.code === 400) {
        sendUserError = 'Name is already in use.';
      } else {
        sendUserError = 'Unknown error.';
      }

      return {
        ...state,
        sendUserError,
        isLoadingSetUser: false,
      };

    case START_REG_BLOCK_CHAIN:
      return {
        ...state,
        blockChainError: '',
        isLoadingBlockChain: true,
      };

    case FETCH_REG_BLOCK_CHAIN_ERROR:
      let blockChainError = '';
      if (error) {
        blockChainError = 'Blockchain internal error.';
      }

      return {
        ...state,
        blockChainError,
      };

    case BLOCK_CHAIN_STOP_LOADER:
      return {
        ...state,
        isLoadingBlockChain: false,
      };

    case CLEAR_REG_ERRORS:
      return {
        ...state,
        sendPhoneError: '',
        sendVerifyError: '',
        sendUserError: '',
        blockChainError: '',
      };

    default:
      return state;
  }
}
