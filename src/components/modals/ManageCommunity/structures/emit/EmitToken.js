import React from 'react';

import { defaults } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

const DEFAULT = {
  symbol: '',
};

export default class EmitToken extends BaseStructure {
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

  renderFields() {
    return this.renderField('symbol', value => (
      <InputSmall value={value} onChange={this.onChange} />
    ));
  }
}
