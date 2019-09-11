import React from 'react';

import { defaults, integerToVesting, vestingToInteger } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class MinAbsRShares extends BaseStructure {
  constructor(props) {
    super(props);

    const state = defaults(this.props.initialValues, this.props.defaults);
    state.value = integerToVesting(state.value);
    this.state = state;
  }

  onChange = e => {
    this.setState(
      {
        value: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const value = vestingToInteger(this.state.value);

    if (Number.isNaN(value)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      value,
    });
  };

  renderFields() {
    return this.renderField('value', value => (
      <InputSmall type="number" value={value} min="0" onChange={this.onChange} />
    ));
  }
}
