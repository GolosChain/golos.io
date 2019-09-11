import React from 'react';

import {
  defaults,
  fieldsToString,
  parsePercentString,
  parsePercent,
  isPositiveInteger,
} from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class InflationRate extends BaseStructure {
  constructor(props) {
    super(props);

    const state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

    state.stop = parsePercent(state.stop);
    state.start = parsePercent(state.start);

    this.state = state;
  }

  onStartChange = e => {
    this.setState({ start: e.target.value }, this.triggerChange);
  };

  onStopChange = e => {
    this.setState({ stop: e.target.value }, this.triggerChange);
  };

  onNarrowingChange = e => {
    this.setState({ narrowing: e.target.value }, this.triggerChange);
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const { narrowing } = this.state;

    const start = parsePercentString(this.state.start);
    const stop = parsePercentString(this.state.stop);

    if (Number.isNaN(start) || Number.isNaN(stop) || !isPositiveInteger(narrowing)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    if (Number(narrowing) === 0 && Number(start) !== Number(stop)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    if (Number(start) < Number(stop)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      start,
      stop,
      narrowing,
    });
  };

  renderFields() {
    return [
      this.renderField('start', value => (
        <InputSmall value={value} onChange={this.onStartChange} />
      )),
      this.renderField('stop', value => <InputSmall value={value} onChange={this.onStopChange} />),
      this.renderField('narrowing', value => (
        <InputSmall value={value} onChange={this.onNarrowingChange} />
      )),
    ];
  }
}
