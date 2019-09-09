import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';

import ErrorLine from '../elements/ErrorLine';
import { FieldSubTitle, InputSmall } from '../elements';

const DEFAULT = {
  actor: '',
  permission: 'active',
};

const Fields = styled.label`
  text-transform: none;
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
    const { fields } = this.props;
    const { actor, permission, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.actor}:</FieldSubTitle>
        <InputSmall value={actor} onChange={this.onActorChange} />
        <FieldSubTitle>{fields.permission}:</FieldSubTitle>
        <InputSmall value={permission} onChange={this.onPermissionChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
