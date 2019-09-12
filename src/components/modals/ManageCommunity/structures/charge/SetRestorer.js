import React from 'react';

import { defaults, isPositiveInteger, fieldsToString } from 'utils/common';
import { Select } from 'components/golos-ui/Form';

import { BaseStructure, Input, InputSmall } from '../elements';

export default class SetRestorer extends BaseStructure {
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
    const { state } = this;

    const charge_id = Number(state.charge_id);
    const func_str = state.func_str.trim();
    const max_prev = state.max_prev.trim();
    const max_vesting = state.max_vesting.trim();
    const max_elapsed = state.max_elapsed.trim();

    if (
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
      token_code: 'GOLOS',
      charge_id,
      func_str,
      max_prev,
      max_vesting,
      max_elapsed,
    });
  };

  renderFields() {
    return [
      this.renderField('charge_id', value => (
        <Select value={value} onChange={e => this.onFieldChange(e, 'charge_id')}>
          <option value="0">Vote (0)</option>
          <option value="1">Post (1)</option>
          <option value="2">Comment (2)</option>
          <option value="3">Post bandwidth (3)</option>
        </Select>
      )),
      this.renderField('func_str', value => (
        <Input value={value} onChange={e => this.onFieldChange(e, 'func_str')} />
      )),
      this.renderField('max_prev', value => (
        <InputSmall value={value} onChange={e => this.onFieldChange(e, 'max_prev')} />
      )),
      this.renderField('max_vesting', value => (
        <InputSmall value={value} onChange={e => this.onFieldChange(e, 'max_vesting')} />
      )),
      this.renderField('max_elapsed', value => (
        <InputSmall value={value} onChange={e => this.onFieldChange(e, 'max_elapsed')} />
      )),
    ];
  }
}
