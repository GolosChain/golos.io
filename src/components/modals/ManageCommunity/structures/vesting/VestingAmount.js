import React, { PureComponent } from 'react';

import { defaults } from 'utils/common';

import { ErrorLine, Fields, InputSmall, InputLine, DefaultText } from '../elements';

export default class VestingAmount extends PureComponent {
  constructor(props) {
    super(props);

    const state = defaults(this.props.initialValues, this.props.defaults);
    state.min_amount = integerToVesting(state.min_amount);
    this.state = state;
  }

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

    const minAmountStr = this.state.min_amount.trim();

    if (!/^\d+(?:\.\d{1,6})?$/.test(minAmountStr)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    const minAmountFloat = Number(minAmountStr);

    const min_amount = Math.floor(minAmountFloat * 1000000);

    if (Number.isNaN(min_amount)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    console.log('min_amount', min_amount);

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
          <DefaultText>(по умолчанию: {integerToVesting(defaults.min_amount)})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}

function integerToVesting(val) {
  return (val / 1000000).toFixed(6);
}
