import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, isPositiveInteger, fieldsToString } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  token_code: 'GOLOS',
  charge_id: 0,
  func_str: 't*p/86400',
  max_prev: 0,
  max_vesting: 0,
  max_elapsed: 0,
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
  width: 150px;
  padding-right: 4px;
`;

export default class SetRestorer extends PureComponent {
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
    const { state } = this;

    const token_code = state.token_code.trim();
    const charge_id = parseInt(state.charge_id, 10);
    const func_str = state.func_str.trim();
    const max_prev = state.max_prev.trim();
    const max_vesting = state.max_vesting.trim();
    const max_elapsed = state.max_elapsed.trim();

    if (
      !token_code ||
      !checkNumber(charge_id) ||
      !func_str ||
      !isPositiveInteger(max_prev) ||
      !isPositiveInteger(max_vesting) ||
      !isPositiveInteger(max_elapsed)
    ) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      token_code,
      charge_id,
      func_str,
      max_prev,
      max_vesting,
      max_elapsed,
    });
  };

  render() {
    const { fields } = this.props;
    const {
      token_code,
      charge_id,
      func_str,
      max_prev,
      max_vesting,
      max_elapsed,
      isInvalid,
    } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.token_code}:</FieldSubTitle>
        <InputSmall value={token_code} onChange={e => this.onFieldChange(e, 'token_code')} />
        <FieldSubTitle>{fields.charge_id}:</FieldSubTitle>
        <InputSmall value={charge_id} onChange={e => this.onFieldChange(e, 'charge_id')} />
        <FieldSubTitle>{fields.func_str}:</FieldSubTitle>
        <Input value={func_str} onChange={e => this.onFieldChange(e, 'func_str')} />
        <FieldSubTitle>{fields.max_prev}:</FieldSubTitle>
        <InputSmall value={max_prev} onChange={e => this.onFieldChange(e, 'max_prev')} />
        <FieldSubTitle>{fields.max_vesting}:</FieldSubTitle>
        <InputSmall value={max_vesting} onChange={e => this.onFieldChange(e, 'max_vesting')} />
        <FieldSubTitle>{fields.max_elapsed}:</FieldSubTitle>
        <InputSmall value={max_elapsed} onChange={e => this.onFieldChange(e, 'max_elapsed')} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}

function checkNumber(val) {
  return typeof val === 'number' || !Number.isNaN(val);
}
