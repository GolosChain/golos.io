import React from 'react';

import { defaults, isPositiveInteger, fieldsToString } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class VestingWithdraw extends BaseStructure {
  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

  onIntervalsChange = e => {
    this.setState(
      {
        intervals: e.target.value,
      },
      this.triggerChange
    );
  };

  onSecondsChange = e => {
    this.setState(
      {
        interval_seconds: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    if (
      !isPositiveInteger(this.state.intervals.trim()) ||
      !isPositiveInteger(this.state.interval_seconds.trim())
    ) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    const intervals = Number(this.state.intervals);
    const interval_seconds = Number(this.state.interval_seconds);

    if (intervals < 1 || interval_seconds < 3) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      intervals,
      interval_seconds,
    });
  };

  renderFields() {
    return [
      this.renderField('intervals', value => (
        <InputSmall
          type="number"
          min="1"
          max="255"
          value={value}
          onChange={this.onIntervalsChange}
        />
      )),
      this.renderField('interval_seconds', value => (
        <InputSmall type="number" min="3" value={value} onChange={this.onSecondsChange} />
      )),
    ];
  }
}
