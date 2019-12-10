import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import keyCodes from 'utils/keyCodes';
import { checkPressedKey } from 'utils/keyPress';
import { setRegistrationData } from 'utils/localStorage';
import SplashLoader from 'components/golos-ui/SplashLoader';

import { MASTER_KEY_SCREEN_ID, PHONE_SCREEN_ID } from '../constants';
import { LOCALE_USERNAME_EMPTY_ERROR, LOCALE_ONE_DOT_IN_NAME } from '../locales';
import { SubTitle, Input, SendButton, BackButton, ErrorText } from '../commonStyled';

const UsernameInput = styled(Input)`
  margin-top: 40px;
  transition: box-shadow 150ms;
  ${({ error, theme }) => (error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed}` : ``)};
`;

const CustomSendButton = styled(SendButton)`
  margin-top: 142px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  & ${Input} {
    border: solid 1px ${({ theme }) => theme.colors.contextLightGrey};
  }
`;

const CustomErrorText = styled(ErrorText)`
  left: 0;
`;

export default class CreateUsername extends PureComponent {
  static propTypes = {
    wishUsername: PropTypes.string.isRequired,
    setScreenId: PropTypes.func.isRequired,
    setWishUsername: PropTypes.func.isRequired,
    isLoadingSetUser: PropTypes.bool.isRequired,
    fetchSetUser: PropTypes.func.isRequired,
    sendUserError: PropTypes.string.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    usernameError: null,
  };

  componentDidMount() {
    const { wishUsername } = this.props;
    if (wishUsername) {
      this.setState({ username: wishUsername });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { wishUsername } = this.props;
    if (wishUsername !== nextProps.wishUsername) {
      this.setState({ username: nextProps.wishUsername });
    }
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  nextScreen = async () => {
    const { setScreenId, fetchSetUser } = this.props;
    const { username } = this.state;

    if (!this.checkUsername(username)) {
      return;
    }
    try {
      const screenId = await fetchSetUser(username);
      const currentScreenId = screenId || MASTER_KEY_SCREEN_ID;
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

  enterUsername = e => {
    const { username } = this.state;
    let currentUsername = e.target.value.trim();
    currentUsername = currentUsername.toLowerCase();
    currentUsername = currentUsername.replace(/[^a-z0-9.-]+/g, '');

    if (username !== currentUsername) {
      this.setState({ username: currentUsername, usernameError: null });
    }
  };

  usernameInputBlur = () => {
    const { setWishUsername } = this.props;
    const { username } = this.state;
    setWishUsername(username);
    setRegistrationData({ wishUsername: username });
  };

  enterKeyDown = e => {
    if (checkPressedKey(e) === keyCodes.ENTER) {
      this.usernameInputBlur();
      this.nextScreen();
    }
  };

  checkUsername(username) {
    if (!username) {
      this.setState({ usernameError: LOCALE_USERNAME_EMPTY_ERROR });
      return false;
    }
    if ((username.match(/\./g) || []).length > 1) {
      this.setState({ usernameError: LOCALE_ONE_DOT_IN_NAME });
      return false;
    }
    return true;
  }

  render() {
    const { isLoadingSetUser, sendUserError } = this.props;
    const { username, usernameError } = this.state;

    const errorText = (usernameError ? tt(usernameError) : null) || sendUserError;

    return (
      <>
        {isLoadingSetUser && <SplashLoader />}
        <SubTitle>{tt('registration.enter_desired_username')}</SubTitle>
        <InputWrapper>
          <UsernameInput
            autoFocus
            placeholder={tt('registration.enter_username')}
            value={username}
            error={errorText}
            className="js-CreateUsernameInput"
            onKeyDown={this.enterKeyDown}
            onChange={this.enterUsername}
            onBlur={this.usernameInputBlur}
          />
          <CustomErrorText>{errorText}</CustomErrorText>
        </InputWrapper>
        <CustomSendButton className="js-CreateUsernameSend" onClick={this.nextScreen}>
          {tt('registration.next')}
        </CustomSendButton>
        <BackButton light className="js-CreateUsernameBack" onClick={this.backToPreviousScreen}>
          {tt('g.back')}
        </BackButton>
      </>
    );
  }
}
