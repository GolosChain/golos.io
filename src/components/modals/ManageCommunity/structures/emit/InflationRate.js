import React, { PureComponent } from 'react';

import {
  defaults,
  fieldsToString,
  parsePercentString,
  parsePercent,
  isPositiveInteger,
} from 'utils/common';

import { Fields, FieldSubTitle, InputLine, InputSmall, DefaultText, ErrorLine } from '../elements';

export default class InflationRate extends PureComponent {
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

  render() {
    const { fields, defaults } = this.props;
    const { start, stop, narrowing, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.start}:</FieldSubTitle>
        <InputLine>
          <InputSmall value={start} onChange={this.onStartChange} />
          <DefaultText>(по умолчанию: {parsePercent(defaults.start)}%)</DefaultText>
        </InputLine>
        <FieldSubTitle>{fields.stop}:</FieldSubTitle>
        <InputLine>
          <InputSmall value={stop} onChange={this.onStopChange} />
          <DefaultText>(по умолчанию: {parsePercent(defaults.stop)}%)</DefaultText>
        </InputLine>
        <FieldSubTitle>{fields.narrowing}:</FieldSubTitle>
        <InputLine>
          <InputSmall value={narrowing} onChange={this.onNarrowingChange} />
          <DefaultText>(по умолчанию: {defaults.narrowing})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
