import React, { PureComponent } from 'react';

import { defaults, isPositiveInteger, fieldsToString } from 'utils/common';

import { Fields, FieldSubTitle, ErrorLine, InputLine, InputSmall, DefaultText } from '../elements';

export default class VestingWithdraw extends PureComponent {
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

  render() {
    const { fields, defaults } = this.props;
    const { intervals, interval_seconds, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.intervals}</FieldSubTitle>
        <InputLine>
          <InputSmall
            type="number"
            min="1"
            max="255"
            value={intervals}
            onChange={this.onIntervalsChange}
          />
          <DefaultText>(по умолчанию: {defaults.intervals})</DefaultText>
        </InputLine>
        <FieldSubTitle>{fields.interval_seconds}</FieldSubTitle>
        <InputLine>
          <InputSmall
            type="number"
            min="3"
            value={interval_seconds}
            onChange={this.onSecondsChange}
          />
          <DefaultText>(по умолчанию: {defaults.interval_seconds})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
