import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import EditGolosPower from 'components/userProfile/common/EditGolosPower';

import { DelegationType } from './types';

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  overflow: hidden;
  animation: fade-in 0.3s;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
`;

const EditGolosPowerStyled = styled(EditGolosPower)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 13px 30px;
`;

export default class DelegationEdit extends PureComponent {
  static propTypes = {
    delegation: DelegationType.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  render() {
    const { delegation, onSave, onCancel } = this.props;

    return (
      <Root>
        <Overlay onClick={onCancel} />
        <EditGolosPowerStyled delegation={delegation} onSave={onSave} onCancel={onCancel} />
      </Root>
    );
  }
}
