import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError, displaySuccess } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { Input } from 'components/golos-ui/Form';

const Wrapper = styled.div`
  position: relative;
  padding: 20px 30px 28px;
  border-radius: 6px;
  background-color: #fff;
`;

const HeaderTitle = styled.h1`
  margin: 0 0 20px 0;
`;

const Fields = styled.div`
  margin-bottom: 20px;
`;

const Field = styled.label`
  text-transform: none;
`;

const FieldTitle = styled.span`
  display: block;
  margin-bottom: 6px;
`;

const FooterButtons = styled.div`
  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

export default class BecomeLeader extends PureComponent {
  static propTypes = {
    needUpdateUrl: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    registerWitness: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
  };

  state = {
    isRegistering: false,
    url: '',
  };

  onUrlChange = e => {
    this.setState({
      url: e.target.value,
    });
  };

  onRegisterClick = async () => {
    const { userId, registerWitness, fetchProfile, waitForTransaction, close } = this.props;
    const { url } = this.state;

    this.setState({
      isRegistering: true,
    });

    let result;

    try {
      result = await registerWitness({ url: url.trim() });
    } catch (err) {
      displayError(err);
      this.setState({
        isRegistering: false,
      });
      return;
    }

    try {
      await waitForTransaction(result.transaction_id);
    } catch {}

    try {
      await fetchProfile({ userId });
    } catch (err) {
      console.warn('Profile fetching failed:', err);
    }

    displaySuccess(tt('g.saved'));

    close();
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { needUpdateUrl } = this.props;
    const { isRegistering, url } = this.state;

    const headerTitle = needUpdateUrl
      ? tt('witnesses_jsx.update_leader_post_url_header')
      : tt('witnesses_jsx.register_dialog.title');
    const buttonTitle = needUpdateUrl ? tt('g.update') : tt('g.register');

    return (
      <Wrapper>
        <HeaderTitle>{headerTitle}</HeaderTitle>
        <Fields>
          <Field>
            <FieldTitle>{tt('witnesses_jsx.register_dialog.url')}:</FieldTitle>
            <Input placeholder="https://" value={url} onChange={this.onUrlChange} />
          </Field>
        </Fields>
        <FooterButtons>
          <Button onClick={this.onRegisterClick}>{buttonTitle}</Button>
          <Button light onClick={this.onCancelClick}>
            {tt('g.cancel')}
          </Button>
        </FooterButtons>
        {isRegistering ? <SplashLoader /> : null}
      </Wrapper>
    );
  }
}
