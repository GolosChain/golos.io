import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  min_breakout: '',
  max_breakout: '',
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

export default class BreakoutParams extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onMinChange = e => {
    this.setState(
      {
        min_breakout: e.target.value,
      },
      this.triggerChange
    );
  };

  onMaxChange = e => {
    this.setState(
      {
        max_breakout: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const min_breakout = this.state.min_breakout.trim();
    const max_breakout = this.state.max_breakout.trim();

    if (!min_breakout || !max_breakout) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      min_breakout,
      max_breakout,
    });
  };

  render() {
    const { fields } = this.props;
    const { min_breakout, max_breakout, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.min_breakout}:</FieldSubTitle>
        <InputSmall value={min_breakout} onChange={this.onMinChange} />
        <FieldSubTitle>{fields.max_breakout}:</FieldSubTitle>
        <InputSmall value={max_breakout} onChange={this.onMaxChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
