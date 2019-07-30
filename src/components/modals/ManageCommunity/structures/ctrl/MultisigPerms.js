import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  super_majority: 0,
  majority: 0,
  minority: 0,
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

export default class MultisigPerms extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onSuperChange = e => {
    this.setState(
      {
        super_majority: e.target.value,
      },
      this.triggerChange
    );
  };

  onMajorityChange = e => {
    this.setState(
      {
        majority: e.target.value,
      },
      this.triggerChange
    );
  };

  onMinorityChange = e => {
    this.setState(
      {
        minority: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const super_majority = parseInt(this.state.super_majority, 10);
    const majority = parseInt(this.state.majority, 10);
    const minority = parseInt(this.state.minority, 10);

    if (
      !super_majority ||
      Number.isNaN(super_majority) ||
      !majority ||
      Number.isNaN(majority) ||
      !minority ||
      Number.isNaN(minority)
    ) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      super_majority,
      majority,
      minority,
    });
  };

  render() {
    const { super_majority, majority, minority, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Super majority:</FieldSubTitle>
        <InputSmall value={super_majority} onChange={this.onSuperChange} />
        <FieldSubTitle>Majority:</FieldSubTitle>
        <InputSmall value={majority} onChange={this.onMajorityChange} />
        <FieldSubTitle>Minority:</FieldSubTitle>
        <InputSmall value={minority} onChange={this.onMinorityChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
