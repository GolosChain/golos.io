import React, { PureComponent } from 'react';

import { defaults, isPositiveInteger, fieldsToString } from 'utils/common';
import { Select } from 'components/golos-ui/Form';

import { Fields, FieldSubTitle, Input, InputSmall, ErrorLine } from '../elements';

export default class SetRestorer extends PureComponent {
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

  render() {
    const { fields } = this.props;
    const { charge_id, func_str, max_prev, max_vesting, max_elapsed, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.charge_id}:</FieldSubTitle>
        <Select value={charge_id} onChange={e => this.onFieldChange(e, 'charge_id')}>
          <option value="0">Vote (0)</option>
          <option value="1">Post (1)</option>
          <option value="2">Comment (2)</option>
          <option value="3">Post bandwidth (3)</option>
        </Select>
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
