import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, fieldsToString, isPositiveInteger } from 'utils/common';
import { Fields, Input, FieldSubTitle, ErrorLine } from '../elements';

const NumberInput = styled(Input).attrs({ type: 'number', min: '0' })`
  width: 130px;
  padding-right: 4px;
`;

export default class VestingDelegation extends PureComponent {
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

  render() {
    const { fields } = this.props;
    const { min_amount, min_remainder, return_time, min_time, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.min_amount}:</FieldSubTitle>
        <NumberInput
          type="number"
          min="0"
          value={min_amount}
          onChange={e => this.onFieldChange(e, 'min_amount')}
        />
        <FieldSubTitle>{fields.min_remainder}:</FieldSubTitle>
        <NumberInput
          type="number"
          min="0"
          value={min_remainder}
          onChange={e => this.onFieldChange(e, 'min_remainder')}
        />
        <FieldSubTitle>{fields.return_time}:</FieldSubTitle>
        <NumberInput
          type="number"
          min="0"
          value={return_time}
          onChange={e => this.onFieldChange(e, 'return_time')}
        />
        <FieldSubTitle>{fields.min_time}:</FieldSubTitle>
        <NumberInput
          type="number"
          min="0"
          value={min_time}
          onChange={e => this.onFieldChange(e, 'min_time')}
        />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
