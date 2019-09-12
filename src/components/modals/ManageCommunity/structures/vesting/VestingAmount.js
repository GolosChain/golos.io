import React from 'react';

import { defaults, integerToVesting, vestingToInteger } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class VestingAmount extends BaseStructure {
  constructor(props) {
    super(props);

    const state = defaults(this.props.initialValues, this.props.defaults);
    state.min_amount = integerToVesting(state.min_amount);
    this.state = state;
  }

  onChange = e => {
    this.setState(
      {
        min_amount: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const min_amount = vestingToInteger(this.state.min_amount);

    if (Number.isNaN(min_amount)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      min_amount,
    });
  };

  renderFields() {
    return this.renderField('min_amount', value => (
      <InputSmall value={value} onChange={this.onChange} />
    ));
  }
}
