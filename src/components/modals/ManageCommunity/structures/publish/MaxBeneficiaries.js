import React from 'react';

import { defaults } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class MaxBeneficiaries extends BaseStructure {
  state = defaults(this.props.initialValues, this.props.defaults);

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
    const { value } = this.state;

    const valueNumber = parseInt(value, 10);

    if (Number.isNaN(valueNumber) || valueNumber < 0 || valueNumber > 255) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      value: valueNumber,
    });
  };

  renderFields() {
    return this.renderField('value', value => (
      <InputSmall type="number" value={value} min="0" max="255" onChange={this.onChange} />
    ));
  }
}
