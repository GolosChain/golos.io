import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import keyCodes from 'utils/keyCodes';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStorage';
import SplashLoader from 'components/golos-ui/SplashLoader';

import { CREATE_USERNAME_SCREEN_ID, PHONE_SCREEN_ID } from '../constants';
import { LOCALE_NOT_FULL_CODE_ERROR, LOCALE_CODE_RESEND_FAIL } from '../locales';
import { BackButton, SendButton, SubTitle, ErrorText } from '../commonStyled';

import { createTimerCookie } from '../SignUp';
import Timer from './Timer';

const NUMBER_OF_INPUTS = 4;

const DividedInput = styled.input`
  width: 49px;
  height: 56px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.41px;
  text-align: center;
  transition: box-shadow 150ms;

  ${({ error, theme }) => (error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed}` : ``)};
`;

const TempHint = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const InputsWrapper = styled.div`
  display: flex;
  /*margin-top: 40px; // Before TempHint*/
  margin-top: 5px;

  & ${DividedInput}:not(:first-child) {
    margin-left: 8px;
  }
`;

const ResendWrapper = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 24px;
`;

const ResendCode = styled.button`
  line-height: 20px;
  font-size: 15px;
  letter-spacing: -0.41px;
  color: ${({ theme }) => theme.colors.contextBlue};

  &:hover,
  &:focus {
    opacity: 0.8;
  }

  ${is('disable')`
    cursor: auto;
    opacity: 0.6;
    pointer-events: none;
  `};
`;

const CustomErrorText = styled(ErrorText)`
  left: 50%;
  transform: translateX(-50%);
`;

export default class ConfirmationCode extends PureComponent {
  static propTypes = {
    setScreenId: PropTypes.func.isRequired,
    fetchRegVerify: PropTypes.func.isRequired,
    isLoadingVerify: PropTypes.bool.isRequired,
    clearVerifyError: PropTypes.func.isRequired,
    sendVerifyError: PropTypes.string.isRequired,
    fetchResendSms: PropTypes.func.isRequired,
    fullPhoneNumber: PropTypes.string.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
    isResendSmsLoading: PropTypes.bool.isRequired,
    resendSmsError: PropTypes.string.isRequired,
    nextSmsRetry: PropTypes.number.isRequired,
  };

  state = {
    inputs: Array.from({ length: NUMBER_OF_INPUTS }).map(() => ''),
    codeError: '',
    timerSeconds: false,
  };

  inputs = Array.from({ length: NUMBER_OF_INPUTS }).map(createRef);

  sendButtonRef = createRef();

  componentDidMount() {
    this.setTimeInCookie();
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  onBackspacePress(e, position) {
    const { sendVerifyError, clearVerifyError } = this.props;
    const { inputs } = this.state;

    if (checkPressedKey(e) === keyCodes.BACKSPACE) {
      const firstElemIndex = 0;
      if (position === firstElemIndex && !inputs[firstElemIndex]) {
        return;
      }
      if (sendVerifyError) {
        clearVerifyError();
      }
      const clonedInputs = Array.from(inputs);

      if (clonedInputs[position].trim()) {
        clonedInputs[position] = '';
      } else {
        clonedInputs[position - 1] = '';
      }

      this.setState({
        inputs: clonedInputs,
        codeError: '',
      });
      if (position > firstElemIndex) {
        this.inputs[position - 1].current.focus();
      }

      e.preventDefault();
    }
  }

  setTimeInCookie() {
    const startSecondsQuantity = createTimerCookie();
    if (startSecondsQuantity) {
      this.setState({ timerSeconds: startSecondsQuantity });
    }
  }

  nextScreen = async () => {
    const { setScreenId, fetchRegVerify } = this.props;
    const { inputs } = this.state;
    const codeStr = inputs.join('');
    const code = Number(codeStr);

    if (codeStr.length < NUMBER_OF_INPUTS) {
      this.setState({ codeError: LOCALE_NOT_FULL_CODE_ERROR });
      return;
    }

    try {
      const screenId = await fetchRegVerify(code);
      const currentScreenId = screenId || CREATE_USERNAME_SCREEN_ID;
      setScreenId(currentScreenId);
      setRegistrationData({ screenId: currentScreenId });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;
    setScreenId(PHONE_SCREEN_ID);
    setRegistrationData({ screenId: PHONE_SCREEN_ID });
  };

  resendCode = async e => {
    const { fetchResendSms, fullPhoneNumber } = this.props;
    const { timerSeconds } = this.state;
    if (e) {
      e.target.blur();
    }
    if (timerSeconds > 0) {
      return;
    }

    try {
      await fetchResendSms(fullPhoneNumber);
      // eslint-disable-next-line react/destructuring-assignment
      const startSecondsQuantity = createTimerCookie(this.props.nextSmsRetry);
      this.setState({ timerSeconds: startSecondsQuantity });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  hideTimer = () => {
    this.setState({ timerSeconds: 0 });
  };

  inputValueChange(e, position) {
    const { sendVerifyError, clearVerifyError } = this.props;
    const { inputs } = this.state;
    let value = e.target.value;
    value = value.replace(/\D+/g, '');

    if (value) {
      const clonedInputs = Array.from(inputs);

      const chars = value.split('');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < chars.length && i + position < NUMBER_OF_INPUTS; i++) {
        clonedInputs[i + position] = chars[i] || '';
      }
      if (sendVerifyError) {
        clearVerifyError();
      }
      this.setState(
        {
          inputs: clonedInputs,
          codeError: '',
        },
        () => {
          const nextPos = position + 1;

          if (nextPos < NUMBER_OF_INPUTS) {
            this.inputs[nextPos].current.focus();
          }
          if (nextPos === NUMBER_OF_INPUTS || chars.length === NUMBER_OF_INPUTS) {
            this.sendButtonRef.current.focus();
          }
        }
      );
    }
  }

  renderInputs() {
    const { sendVerifyError } = this.props;
    const { inputs, codeError } = this.state;
    const notFullCodeError = codeError === LOCALE_NOT_FULL_CODE_ERROR;

    return Array.from({ length: NUMBER_OF_INPUTS }).map((item, index) => (
      <DividedInput
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        ref={this.inputs[index]}
        name={`sign-up__confirmation-code-input-${index + 1}`}
        type="number"
        min="0"
        max="9"
        maxlength="1"
        autocomplete="off"
        autoFocus={index === 0}
        value={inputs[index]}
        error={(notFullCodeError && !inputs[index]) || sendVerifyError}
        className={`js-ConfirmationCodeInput-${index}`}
        onKeyDown={e => this.onBackspacePress(e, index)}
        onChange={e => this.inputValueChange(e, index)}
      />
    ));
  }

  render() {
    const { isLoadingVerify, sendVerifyError, isResendSmsLoading, resendSmsError } = this.props;
    const { codeError, timerSeconds } = this.state;

    let resendText = tt('registration.resend_send_verification_code');
    if (isResendSmsLoading) {
      resendText = tt('g.loading');
    }
    if (resendSmsError) {
      resendText = LOCALE_CODE_RESEND_FAIL;
    }

    return (
      <>
        {isLoadingVerify && <SplashLoader />}
        <SubTitle>{tt('registration.enter_verification_code_from_sms')}</SubTitle>
        <TempHint>
          Функционал временно недоступен - введите <strong>9999</strong>
        </TempHint>
        <InputsWrapper>{this.renderInputs()}</InputsWrapper>
        <ResendWrapper>
          <ResendCode
            disable={isResendSmsLoading ? 1 : 0}
            className="js-ConfirmationCodeResend"
            onClick={this.resendCode}
          >
            {resendText}
            &nbsp;
            {Boolean(timerSeconds) && (
              <Timer startingTime={timerSeconds} hideTimer={this.hideTimer} />
            )}
          </ResendCode>
          <CustomErrorText>{codeError || sendVerifyError}</CustomErrorText>
        </ResendWrapper>
        <SendButton
          ref={this.sendButtonRef}
          className="js-ConfirmationCodeSend"
          onClick={this.nextScreen}
        >
          {tt('registration.next')}
        </SendButton>
        <BackButton light className="js-ConfirmationCodeBack" onClick={this.backToPreviousScreen}>
          {tt('g.back')}
        </BackButton>
      </>
    );
  }
}
