import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'components/golos-ui/Button';
import { Input } from 'components/golos-ui/Form';
import { displayError } from 'utils/toastMessages';

const Wrapper = styled.div`
  padding: 30px;
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

    try {
      await registerWitness({ url });
      close();
    } catch (err) {
      displayError(err);
    }
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { url } = this.state;

    return (
      <Wrapper>
        <HeaderTitle>Зарегистрироваться как делегат</HeaderTitle>
        <Fields>
          <Field>
            <FieldTitle>Ссылка на приветственный пост:</FieldTitle>
            <Input placeholder="https://" value={url} onChange={this.onUrlChange} />
          </Field>
        </Fields>
        <FooterButtons>
          <Button onClick={this.onRegisterClick}>Register</Button>
          <Button light onClick={this.onCancelClick}>
            Cancel
          </Button>
        </FooterButtons>
      </Wrapper>
    );
  }
}
