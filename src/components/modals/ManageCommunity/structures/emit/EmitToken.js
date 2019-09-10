import React, { PureComponent } from 'react';

import { defaults } from 'utils/common';

import { Fields, InputSmall, ErrorLine } from '../elements';

const DEFAULT = {
  symbol: '',
};

export default class EmitToken extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onChange = e => {
    this.setState(
      {
        symbol: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const symbol = this.state.symbol.trim();

    if (!symbol) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      symbol,
    });
  };

  render() {
    const { symbol, isInvalid } = this.state;

    return (
      <Fields>
        <InputSmall value={symbol} onChange={this.onChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
