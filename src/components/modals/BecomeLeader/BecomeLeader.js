import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError } from 'utils/toastMessages';
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
    close: PropTypes.func.isRequired,
    registerWitness: PropTypes.func.isRequired,
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
    const { registerWitness, close } = this.props;
    const { url } = this.state;

    this.setState({
      isRegistering: true,
    });

    try {
      await registerWitness({ url });
      close();
    } catch (err) {
      displayError(err);

      this.setState({
        isRegistering: false,
      });
    }
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { isRegistering, url } = this.state;

    return (
      <Wrapper>
        <HeaderTitle>{tt('witnesses_jsx.register_dialog.title')}</HeaderTitle>
        <Fields>
          <Field>
            <FieldTitle>{tt('witnesses_jsx.register_dialog.url')}:</FieldTitle>
            <Input placeholder="https://" value={url} onChange={this.onUrlChange} />
          </Field>
        </Fields>
        <FooterButtons>
          <Button onClick={this.onRegisterClick}>{tt('g.register')}</Button>
          <Button light onClick={this.onCancelClick}>
            {tt('g.cancel')}
          </Button>
        </FooterButtons>
        {isRegistering ? <SplashLoader /> : null}
      </Wrapper>
    );
  }
}
