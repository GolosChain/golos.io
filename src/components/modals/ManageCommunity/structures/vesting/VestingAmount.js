import React, { PureComponent } from 'react';

import { defaults, fieldsToString } from 'utils/common';

import { ErrorLine, Fields, InputSmall, InputLine, DefaultText } from '../elements';

export default class VestingAmount extends PureComponent {
  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

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
    const { defaults } = this.props;
    const { min_amount, isInvalid } = this.state;

    return (
      <Fields>
        <InputLine>
          <InputSmall value={min_amount} onChange={this.onChange} />
          <DefaultText>(по умолчанию: {defaults.min_amount})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
