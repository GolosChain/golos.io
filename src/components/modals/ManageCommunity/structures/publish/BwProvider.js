import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  actor: '',
  permission: 'active',
};

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

export default class BwProvider extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onActorChange = e => {
    this.setState(
      {
        actor: e.target.value,
      },
      this.triggerChange
    );
  };

  onPermissionChange = e => {
    this.setState(
      {
        permission: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const actor = this.state.actor.trim();
    const permission = this.state.permission.trim();

    if (!actor || !permission) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      actor,
      permission,
    });
  };

  render() {
    const { actor, permission, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Актор:</FieldSubTitle>
        <InputSmall value={actor} onChange={this.onActorChange} />
        <FieldSubTitle>Уровень разрешений:</FieldSubTitle>
        <InputSmall value={permission} onChange={this.onPermissionChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}