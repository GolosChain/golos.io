import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { displayError } from 'utils/toastMessages';
import { Input } from 'components/golos-ui/Form';
import Button from 'components/golos-ui/Button';

const Fields = styled.label`
  text-transform: none;
`;

const FieldSubTitle = styled.h3`
  display: block;
  margin-top: 4px;
  font-size: 15px;
  font-weight: normal;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

const Buttons = styled.div`
  margin-top: 8px;
`;

const SaveButton = styled(Button)``;

export default class CuratorPercent extends PureComponent {
  state = {
    actor: '',
    permission: '',
  };

  onActorChange = e => {
    this.setState({
      actor: e.target.value,
    });
  };

  onPermissionChange = e => {
    this.setState({
      permission: e.target.value,
    });
  };

  onSaveClick = () => {
    const { onChange } = this.props;
    const actor = this.state.actor.trim();
    const permission = this.state.permission.trim();

    if (!actor || !permission) {
      displayError('Введены некорректные значения');
      return;
    }

    onChange({
      actor,
      permission,
    });
  };

  render() {
    const { actor, permission } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Актор:</FieldSubTitle>
        <InputSmall value={actor} onChange={this.onActorChange} />
        <FieldSubTitle>Уровень разрешений:</FieldSubTitle>
        <InputSmall value={permission} onChange={this.onPermissionChange} />
        <Buttons>
          <SaveButton onClick={this.onSaveClick}>Save</SaveButton>
        </Buttons>
      </Fields>
    );
  }
}
