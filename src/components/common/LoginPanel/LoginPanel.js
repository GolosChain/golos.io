import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Button from 'components/golos-ui/Button';
import Icon from 'components/golos-ui/Icon';
import { logOpenDialogAnalytics } from 'helpers/gaLogs';
import { checkPressedKey } from 'utils/keyPress';
import KEY_CODES from 'utils/keyCodes';

import { MODAL_CONFIRM, MODAL_CANCEL } from 'store/constants/modalTypes';

const Wrapper = styled.div`
  position: relative;
  width: 460px;
  padding: 20px 30px;

  font: 14px Roboto, sans-serif;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 500px) {
    width: 100%;
    margin: 10px;
    min-width: 300px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 22px;
  right: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  margin: -6px;
  color: #e1e1e1;

  &:hover {
    color: #b9b9b9;
  }
`;

const Title = styled.h1`
  width: 100%;
  padding: 4px 12px;
  margin-bottom: 20px;
  text-align: center;
  color: #393636;
  font-size: 24px;
  font-weight: 900;
  line-height: 32px;
`;

const Form = styled.form`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const ErrorBlock = styled.div`
  min-height: 30px;
  padding: 6px 0;
  line-height: 16px;
  font-size: 12px;
  color: #fc5d16;
`;

const LoginBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  border-radius: 6px;
  border: solid 1px #e1e1e1;
`;

const LoginLabel = styled.div`
  width: 30px;
  line-height: 26px;
  border-right: solid 1px #e1e1e1;
  font-weight: 500;
  text-align: center;

  &::after {
    content: '@';
    color: #bebebe;
  }
`;

const Input = styled.input`
  padding: 0 12px;
  font-size: 14px;
  color: #393636;
  outline: none;
  box-shadow: none !important;
  appearance: none;
`;

const LoginInput = styled(Input)`
  flex: 1;
  border: none;
  border-radius: 0 5px 5px 0;
  background: transparent;
`;

const PasswordInput = styled(Input)`
  height: 30px;
  width: 100%;
  border-radius: 6px;
  border: solid 1px #e1e1e1;
`;

const LoginButton = styled(Button)`
  width: 170px;
  align-self: center;
  margin-bottom: 0;
`;

export default class LoginForm extends Component {
  static propTypes = {
    isConfirm: PropTypes.bool,
    keyRole: PropTypes.oneOf(['owner', 'active', 'posting']),
    lockUsername: PropTypes.bool,
    username: PropTypes.string,
    login: PropTypes.func.isRequired,
    close: PropTypes.func,
  };

  static defaultProps = {
    username: null,
    keyRole: 'active',
    isConfirm: false,
    lockUsername: false,
    close: null,
  };

  state = {
    /* eslint-disable react/destructuring-assignment */
    user: this.props.lockUsername ? this.props.username : '',
    password: '',
    loginError: null,
    passwordError: null,
    submitting: false,
  };

  handleChange = name => e => {
    const { value } = e.target;
    this.setState({
      [name]: value,
      loginError: null,
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { keyRole, isConfirm, login, close } = this.props;
    const { user, password } = this.state;

    const userName = user.trim().toLowerCase();

    try {
      this.setState({
        loginError: null,
        submitting: true,
      });

      const needSaveAuth = !isConfirm;
      const needGateAuthorize = !isConfirm;

      const auth = await login(userName, password, { needSaveAuth, needGateAuthorize, keyRole });

      if (close) {
        close({ status: MODAL_CONFIRM, auth });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      this.setState({
        loginError: err.message,
        submitting: false,
      });
    }
  };

  onKeyPressPassword = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.handleSubmit();
    }
  };

  onCrossClick = async () => {
    const { close } = this.props;
    await close({ status: MODAL_CANCEL });
  };

  logEventAnalytics() {
    const { isConfirm } = this.props;
    if (!isConfirm) {
      logOpenDialogAnalytics('Sign in dialog');
    }
  }

  render() {
    const { isConfirm, lockUsername, close, className } = this.props;
    const { user, password, loginError, passwordError, submitting } = this.state;

    return (
      <Wrapper className={className}>
        {close ? (
          <CloseButton onClick={this.onCrossClick}>
            <Icon name="cross_thin" width={16} height={16} />
          </CloseButton>
        ) : null}
        <Form onSubmit={this.handleSubmit}>
          <Title>{isConfirm ? tt('loginform_jsx.authorize_for') : tt('g.login')}</Title>
          <LoginBlock>
            <LoginLabel />
            <LoginInput
              placeholder={tt('loginform_jsx.enter_your_username')}
              autoCapitalize="no"
              autoCorrect="off"
              spellCheck="false"
              readOnly={submitting || lockUsername}
              required
              name="login__username-input"
              value={user}
              onChange={this.handleChange('user')}
            />
          </LoginBlock>
          <ErrorBlock>{loginError}</ErrorBlock>
          <PasswordInput
            type="password"
            placeholder={
              isConfirm
                ? tt('loginform_jsx.password_or_active')
                : tt('loginform_jsx.password_or_posting')
            }
            required
            disabled={submitting}
            name="login__password-input"
            value={password}
            onChange={this.handleChange('password')}
          />
          <ErrorBlock>{passwordError}</ErrorBlock>
          <LoginButton type="submit" disabled={submitting} name="login__submit">
            {isConfirm ? tt('g.authorize') : tt('g.login')}
          </LoginButton>
        </Form>
      </Wrapper>
    );
  }
}
