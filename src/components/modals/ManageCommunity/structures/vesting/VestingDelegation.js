import React from 'react';
import styled from 'styled-components';

import { defaults, fieldsToString, isPositiveInteger } from 'utils/common';
import { BaseStructure, Input } from '../elements';

const NumberInput = styled(Input).attrs({ type: 'number', min: '0' })`
  width: 130px;
  padding-right: 4px;
`;

export default class VestingDelegation extends BaseStructure {
  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

  onFieldChange = (e, fieldName) => {
    this.setState(
      {
        [fieldName]: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const min_amount = this.state.min_amount.trim();
    const min_remainder = this.state.min_remainder.trim();
    const return_time = this.state.return_time.trim();
    const min_time = this.state.min_time.trim();

    if (
      !isPositiveInteger(min_amount) ||
      !isPositiveInteger(min_remainder) ||
      !isPositiveInteger(return_time) ||
      !isPositiveInteger(min_time)
    ) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      min_amount,
      min_remainder,
      return_time,
      min_time,
      max_delegators: Number(this.state.max_delegators),
    });
  };

  renderFields() {
    return [
      this.renderField('min_amount', value => (
        <NumberInput
          type="number"
          min="0"
          value={value}
          onChange={e => this.onFieldChange(e, 'min_amount')}
        />
      )),
      this.renderField('min_remainder', value => (
        <NumberInput
          type="number"
          min="0"
          value={value}
          onChange={e => this.onFieldChange(e, 'min_remainder')}
        />
      )),
      this.renderField('return_time', value => (
        <NumberInput
          type="number"
          min="0"
          value={value}
          onChange={e => this.onFieldChange(e, 'return_time')}
        />
      )),
      this.renderField('min_time', value => (
        <NumberInput
          type="number"
          min="0"
          value={value}
          onChange={e => this.onFieldChange(e, 'min_time')}
        />
      )),
    ];
  }
}
