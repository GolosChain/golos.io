import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../elements/ErrorLine';

const DEFAULT = {
  min_amount: 0,
};

const Fields = styled.label`
  text-transform: none;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

export default class VestingAmount extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onChange = e => {
    this.setState(
      {
        min_amount: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const min_amount = this.state.min_amount.trim();

    if (!min_amount || !/^\d+$/.test(min_amount)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      min_amount,
    });
  };

  render() {
    const { min_amount, isInvalid } = this.state;

    return (
      <Fields>
        <InputSmall value={min_amount} onChange={this.onChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
