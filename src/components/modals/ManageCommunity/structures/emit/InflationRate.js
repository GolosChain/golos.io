import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  start: 1500,
  stop: 95,
  narrowing: 250000,
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

export default class InflationRate extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

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

    const super_majority = parseInt(this.state.super_majority, 10);
    const majority = parseInt(this.state.majority, 10);
    const minority = parseInt(this.state.minority, 10);

    if (
      !super_majority ||
      Number.isNaN(super_majority) ||
      !majority ||
      Number.isNaN(majority) ||
      !minority ||
      Number.isNaN(minority)
    ) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      super_majority,
      majority,
      minority,
    });
  };

  render() {
    const { fields } = this.props;
    const { start, stop, narrowing, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.start}:</FieldSubTitle>
        <InputSmall value={start} onChange={this.onStartChange} />
        <FieldSubTitle>{fields.stop}:</FieldSubTitle>
        <InputSmall value={stop} onChange={this.onStopChange} />
        <FieldSubTitle>{fields.narrowing}:</FieldSubTitle>
        <InputSmall value={narrowing} onChange={this.onNarrowingChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
