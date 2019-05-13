import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import tt from 'counterpart';

import { getRegistrationData } from 'utils/localStorage';
import { forwardRef } from 'utils/hocs';

import {
  PHONE_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CONGRATULATIONS_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
  MILLISECONDS_IN_SECOND,
} from './constants';

import Phone from './Phone';
import ConfirmationCode from './ConfirmationCode';
import CreateUsername from './CreateUsername';
import MasterKey from './MasterKey';
import Congratulations from './Congratulations';

const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: 400px;
  padding: 40px 31px;
  border-radius: 10px;
  background-color: #fff;
  font-family: ${({ theme }) => theme.fontFamily};

  ${up('mobileLandscape')} {
    padding: 40px 56px;
  }
`;

const Title = styled.h2`
  margin: 12px 0;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.41px;
`;

@forwardRef()
export default class SignUp extends Component {
  static propTypes = {
    openedFrom: PropTypes.string,
    screenId: PropTypes.string.isRequired,
    setScreenId: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    setLocalStorageData: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    openedFrom: '',
  };

  componentDidMount() {
    this.getPreviousDataIfNeeded();
  }

  componentWillUnmount() {
    const { setScreenId } = this.props;
    setScreenId('');
  }

  getPreviousDataIfNeeded() {
    const { setLocalStorageData } = this.props;
    setLocalStorageData(getRegistrationData());
  }

  canClose = async () => {
    const { screenId, openConfirmDialog } = this.props;
    if (
      screenId === CONFIRM_CODE_SCREEN_ID ||
      screenId === CREATE_USERNAME_SCREEN_ID ||
      screenId === MASTER_KEY_SCREEN_ID
    ) {
      return openConfirmDialog('You should complete registration, data can be missed otherwise.', {
        confirmText: 'Close',
      });
    }
    return true;
  };

  render() {
    const { openedFrom, screenId, setScreenId, openModal, close } = this.props;

    let CurrentScreen;
    switch (screenId) {
      case CONFIRM_CODE_SCREEN_ID:
        CurrentScreen = ConfirmationCode;
        break;
      case CREATE_USERNAME_SCREEN_ID:
        CurrentScreen = CreateUsername;
        break;
      case MASTER_KEY_SCREEN_ID:
        CurrentScreen = MasterKey;
        break;
      case CONGRATULATIONS_SCREEN_ID:
        CurrentScreen = Congratulations;
        break;
      default:
        CurrentScreen = Phone;
    }

    return (
      <Wrapper className={`js-SignUp-${screenId || PHONE_SCREEN_ID}-modal`}>
        {screenId !== CONGRATULATIONS_SCREEN_ID && <Title>{tt('g.sign_up')}</Title>}
        <CurrentScreen
          openedFrom={openedFrom}
          setScreenId={setScreenId}
          openModal={openModal}
          close={close}
        />
      </Wrapper>
    );
  }
}

function setCookie(seconds) {
  const currentTime = Date.now();
  const expiredTime = currentTime + seconds * MILLISECONDS_IN_SECOND;
  const expiredDate = new Date(expiredTime).toUTCString();
  document.cookie = `resendCodeTimer=${expiredTime}; path=/; expires=${expiredDate}`;
  return seconds;
}
// eslint-disable-next-line consistent-return
export function createTimerCookie(nextSmsRetry) {
  if (nextSmsRetry) {
    const expectationTime = Math.round((nextSmsRetry - Date.now()) / 1000);
    if (expectationTime > 0) {
      return setCookie(expectationTime);
    }
  }
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const cookieKeyValue = cookie.split('=');
    if (cookieKeyValue[0] === 'resendCodeTimer') {
      return Math.round((cookieKeyValue[1] - Date.now()) / MILLISECONDS_IN_SECOND);
    }
  }
}
