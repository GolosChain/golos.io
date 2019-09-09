import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../elements/ErrorLine';

const DEFAULT = {
  value: 21,
};

const Fields = styled.label`
  text-transform: none;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

export default class EmitInterval extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

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
    const value = parseInt(this.state.value, 10);

    if (!value || Number.isNaN(value)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      value,
    });
  };

  render() {
    const { value, isInvalid } = this.state;

    return (
      <Fields>
        <InputSmall value={value} onChange={this.onChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
