import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { getKeyPair } from 'cyber-client/lib/auth';

import { getAuth } from 'utils/localStorage';
import { CardContent } from 'components/golos-ui/Card';
import ShowKey from './ShowKey.connect';

const KeysBlock = styled.div`
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;

const Info = styled.div`
  color: #959595;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 40px;
`;

const Title = styled.div`
  color: #393636;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const authTypes = ['posting', 'active', 'owner'];

export default class Current extends Component {
  static propTypes = {
    profile: PropTypes.shape().isRequired,
    publicKeys: PropTypes.shape({}).isRequired,
  };

  renderKeys = () => {
    const { publicKeys, profile } = this.props;

    const { privateKey } = getAuth();
    const keyPair = getKeyPair(privateKey);

    return authTypes.map(authType => {
      const pubKey = publicKeys[authType];
      let privKey;

      if (keyPair.publicKey === pubKey) {
        privKey = keyPair.privateKey;
      }

      if (!pubKey) {
        return null;
      }

      return (
        <KeysBlock key={authType}>
          <Title>{tt(`g.${authType}`)}</Title>
          <ShowKey authType={authType} pubkey={pubKey} privateKey={privKey} profile={profile} />
        </KeysBlock>
      );
    });
  };

  render() {
    return (
      <CardContent column>
        <Info>{tt('settings_jsx.keys.info')}</Info>
        {this.renderKeys()}
      </CardContent>
    );
  }
}
