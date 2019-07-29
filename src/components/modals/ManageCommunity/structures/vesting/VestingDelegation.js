import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, fieldsToString, isPositiveInteger } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  min_amount: 0,
  min_remainder: 0,
  return_time: 0,
  min_time: 0,
  max_delegators: 0,
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

const NumberInput = styled(Input).attrs({ type: 'number', min: '0' })`
  width: 130px;
  padding-right: 4px;
`;

export default class VestingDelegation extends PureComponent {
  state = fieldsToString(defaults(this.props.initialValues, DEFAULT));

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
    const max_delegators = this.state.max_delegators.trim();

    if (
      !isPositiveInteger(min_amount) ||
      !isPositiveInteger(min_remainder) ||
      !isPositiveInteger(return_time) ||
      !isPositiveInteger(min_time) ||
      !isPositiveInteger(max_delegators)
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
      max_delegators,
    });
  };

  render() {
    const {
      min_amount,
      min_remainder,
      return_time,
      min_time,
      max_delegators,
      isInvalid,
    } = this.state;

    return (
      <Fields>
        <FieldSubTitle>min_amount:</FieldSubTitle>
        <NumberInput value={min_amount} onChange={e => this.onFieldChange(e, 'min_amount')} />
        <FieldSubTitle>min_remainder:</FieldSubTitle>
        <NumberInput value={min_remainder} onChange={e => this.onFieldChange(e, 'min_remainder')} />
        <FieldSubTitle>return_time:</FieldSubTitle>
        <NumberInput value={return_time} onChange={e => this.onFieldChange(e, 'return_time')} />
        <FieldSubTitle>min_time:</FieldSubTitle>
        <NumberInput
          type="number"
          min="0"
          value={min_time}
          onChange={e => this.onFieldChange(e, 'min_time')}
        />
        <FieldSubTitle>max_delegators:</FieldSubTitle>
        <NumberInput
          value={max_delegators}
          onChange={e => this.onFieldChange(e, 'max_delegators')}
        />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
