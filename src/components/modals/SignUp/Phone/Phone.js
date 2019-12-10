import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { up } from 'styled-breakpoints';
import tt from 'counterpart';
import Captcha from 'react-google-recaptcha';

import { RECAPTCHA_KEY } from 'constants/config';
import keyCodes from 'utils/keyCodes';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStorage';
import SplashLoader from 'components/golos-ui/SplashLoader';

import { SHOW_MODAL_LOGIN, MODAL_CANCEL, OPENED_FROM_LOGIN } from 'store/constants/modalTypes';
import {
  LOCALE_PHONE_EMPTY_ERROR,
  LOCALE_PHONE_SHORT_ERROR,
  INVALID_CAPTCHA_ERROR,
  LOCALE_LOC_DATA_ERROR,
} from '../locales';
import { CONFIRM_CODE_SCREEN_ID } from '../constants';
import { BackButton, SendButton, SubTitle, ErrorText, Input } from '../commonStyled';

import { createTimerCookie } from '../SignUp';
import CountryChooser from './CountryChooser';

const DataInWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  ${up('tablet')} {
    max-width: 288px;
  }
`;

const PhoneInputWrapper = styled.label`
  display: flex;
  margin-top: 12px;
  border-radius: 8px;
  cursor: text;
  transition: box-shadow 150ms;

  ${({ error, theme }) => `
    color: ${theme.colors.contextBlack};
    border: solid 1px ${theme.colors.contextLightGrey};
    ${error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed}` : ``};
  `};
`;

const CaptchaWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
`;

const PreInputNumberCode = styled.div`
  padding: 12px 13px 12px 16px;
  line-height: 20px;
  font-size: 17px;
  letter-spacing: -0.41px;

  ${({ isFilled, theme }) => `
    color: ${isFilled ? theme.colors.contextBlack : '#c8c8c8'};
  `};
`;

const PhoneInput = styled(Input)`
  ${is('isCode')`
    padding-left: 0;
  `};
`;

export default class Phone extends PureComponent {
  static propTypes = {
    phoneNumber: PropTypes.string.isRequired,
    openedFrom: PropTypes.string,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    setPhoneNumber: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
    setLocationData: PropTypes.func.isRequired,
    locationData: PropTypes.shape({
      code: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      countryCode: PropTypes.string.isRequired,
    }).isRequired,
    fetchRegFirstStep: PropTypes.func.isRequired,
    isLoadingFirstStep: PropTypes.bool.isRequired,
    sendPhoneError: PropTypes.string.isRequired,
    firstStepStopLoader: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
    nextSmsRetry: PropTypes.number.isRequired,
  };

  static defaultProps = {
    openedFrom: '',
  };

  state = {
    phoneNumber: '',
    phoneNumberError: null,
    locationDataError: null,
    captchaError: null,
    isInputWrapperFocused: false,
    captcha: null,
  };

  phoneInputRef = createRef();

  componentDidMount() {
    const { phoneNumber } = this.props;
    if (phoneNumber) {
      this.setState({ phoneNumber });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { phoneNumber, locationData } = this.props;
    if (phoneNumber !== nextProps.phoneNumber) {
      this.setState({ phoneNumber: nextProps.phoneNumber });
    }
    if (locationData.code !== nextProps.locationData.code) {
      this.resetLocDataError();
    }
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  setPhoneNumberInStore() {
    const { setPhoneNumber, phoneNumber: phoneNumberFromStore } = this.props;
    const { phoneNumber } = this.state;

    if (phoneNumberFromStore !== phoneNumber) {
      setPhoneNumber(phoneNumber);
      setRegistrationData({ phoneNumber });
    }
  }

  checkPhoneData = async () => {
    const {
      setScreenId,
      locationData,
      fetchRegFirstStep,
      isLoadingFirstStep,
      firstStepStopLoader,
    } = this.props;
    const { phoneNumber, captcha } = this.state;

    if (isLoadingFirstStep) {
      return;
    }
    if (!locationData.code) {
      this.setState({ locationDataError: LOCALE_LOC_DATA_ERROR });
      return;
    }
    if (!phoneNumber) {
      this.setState({ phoneNumberError: LOCALE_PHONE_EMPTY_ERROR });
      return;
    }
    if ((phoneNumber.match(/\d/g) || []).length < 2) {
      this.setState({ phoneNumberError: LOCALE_PHONE_SHORT_ERROR });
      return;
    }
    if (!captcha) {
      this.setState({ captchaError: INVALID_CAPTCHA_ERROR });
      return;
    }

    try {
      const phone = `+${locationData.code}${phoneNumber.replace(/[^0-9]+/g, '')}`;

      const screenId = await fetchRegFirstStep({
        phone,
        captcha,
      });

      const currentScreenId = screenId || CONFIRM_CODE_SCREEN_ID;
      firstStepStopLoader();
      // eslint-disable-next-line react/destructuring-assignment
      createTimerCookie(this.props.nextSmsRetry);
      setScreenId(currentScreenId);
      setRegistrationData({ screenId: currentScreenId });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
      firstStepStopLoader();
    }
  };

  enterKeyDown = e => {
    if (checkPressedKey(e) === keyCodes.ENTER) {
      this.setPhoneNumberInStore();
      this.checkPhoneData();
    }
  };

  enterPhoneNumber = e => {
    const { phoneNumber } = this.state;
    const currentPhoneNumber = e.target.value.replace(/[^\d()-]+/g, '');

    if (phoneNumber !== currentPhoneNumber) {
      this.setState({ phoneNumber: currentPhoneNumber, phoneNumberError: null });
    }
  };

  replaceWithLoginModal = async () => {
    const { openedFrom, openModal, close } = this.props;

    if (openedFrom === OPENED_FROM_LOGIN) {
      await close({ status: MODAL_CANCEL });
      openModal(SHOW_MODAL_LOGIN);
    } else {
      close({ status: MODAL_CANCEL });
    }
  };

  phoneInputBlured = () => {
    this.setPhoneNumberInStore();
    this.setState({ isInputWrapperFocused: false });
  };

  phoneInputFocused = () => {
    this.setState({ isInputWrapperFocused: true });
  };

  resetLocDataError = () => {
    const { locationDataError } = this.state;
    if (locationDataError) {
      this.setState({ locationDataError: null });
    }
  };

  onCaptchaChange = response => {
    this.setState({
      captcha: response,
      captchaError: null,
    });
  };

  renderErrors() {
    const { sendPhoneError } = this.props;
    const { phoneNumberError, captchaError, locationDataError } = this.state;

    let errorText = null;

    if (sendPhoneError) {
      errorText = sendPhoneError;
    } else {
      const errId = locationDataError || phoneNumberError || captchaError;

      if (errId) {
        errorText = tt(errId);
      }
    }

    return <ErrorText>{errorText}</ErrorText>;
  }

  render() {
    const { locationData, isLoadingFirstStep, setLocationData } = this.props;
    const { phoneNumber, phoneNumberError, locationDataError, isInputWrapperFocused } = this.state;
    const { code } = locationData;

    return (
      <>
        {isLoadingFirstStep ? <SplashLoader /> : null}
        <SubTitle>{tt('registration.enter_your_phone_number')}</SubTitle>
        <DataInWrapper>
          <CountryChooser
            phoneInputRef={this.phoneInputRef}
            locationData={locationData}
            locationDataError={locationDataError}
            setLocationData={setLocationData}
            resetLocDataError={this.resetLocDataError}
          />
          <PhoneInputWrapper focused={isInputWrapperFocused} error={phoneNumberError}>
            {code ? (
              <PreInputNumberCode isFilled={phoneNumber ? 1 : 0}>+{code}</PreInputNumberCode>
            ) : null}
            <PhoneInput
              placeholder={tt('registration.enter_phone_number')}
              name="sign-up__phone-input"
              ref={this.phoneInputRef}
              type="tel"
              value={phoneNumber}
              isCode={code ? 1 : 0}
              onFocus={this.phoneInputFocused}
              onKeyDown={this.enterKeyDown}
              onChange={this.enterPhoneNumber}
              onBlur={this.phoneInputBlured}
            />
          </PhoneInputWrapper>
          <CaptchaWrapper>
            <Captcha sitekey={RECAPTCHA_KEY} onChange={this.onCaptchaChange} />
          </CaptchaWrapper>
          {this.renderErrors()}
        </DataInWrapper>
        <SendButton className="js-VerificationCodeSend" onClick={this.checkPhoneData}>
          {tt('registration.send_verification_code')}
        </SendButton>
        <BackButton light className="js-VerificationCodeBack" onClick={this.replaceWithLoginModal}>
          {tt('g.back')}
        </BackButton>
      </>
    );
  }
}
