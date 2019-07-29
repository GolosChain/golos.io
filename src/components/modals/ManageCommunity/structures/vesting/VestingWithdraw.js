import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, isPositiveInteger, fieldsToString } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  intervals: 13,
  interval_seconds: 259200,
};

const Fields = styled.label`
  text-transform: none;
`;

const FieldSubTitle = styled.h3`
  display: block;
  margin-top: 4px;
  font-size: 15px;
  font-weight: normal;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

export default class VestingWithdraw extends PureComponent {
  state = fieldsToString(defaults(this.props.initialValues, DEFAULT));

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
    const { intervals, interval_seconds, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Количество интервалов</FieldSubTitle>
        <InputSmall
          type="number"
          min="1"
          max="255"
          value={intervals}
          onChange={this.onIntervalsChange}
        />
        <FieldSubTitle>Время интервала (сек)</FieldSubTitle>
        <InputSmall
          type="number"
          min="3"
          value={interval_seconds}
          onChange={this.onSecondsChange}
        />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
