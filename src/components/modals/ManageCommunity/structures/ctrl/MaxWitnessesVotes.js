import React from 'react';

import { defaults, fieldsToString } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class MaxWitnessesVotes extends BaseStructure {
  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

  onChange = e => {
    this.setState(
      {
        max: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const max = parseInt(this.state.max, 10);

    if (!max || Number.isNaN(max)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      max,
    });
  };

  renderFields() {
    return this.renderField('max', (value, inputProps) => (
      <InputSmall value={value} {...inputProps} onChange={this.onChange} />
    ));
  }
}
