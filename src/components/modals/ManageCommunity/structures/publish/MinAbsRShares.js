import React, { PureComponent } from 'react';

import { defaults, fieldsToString, isPositiveInteger } from 'utils/common';

import { Fields, InputLine, InputSmall, DefaultText, ErrorLine } from '../elements';

export default class MinAbsRShares extends PureComponent {
  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

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

    if (!isPositiveInteger(value)) {
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
    const { defaults } = this.props;
    const { value, isInvalid } = this.state;

    return (
      <Fields>
        <InputLine>
          <InputSmall type="number" value={value} min="0" onChange={this.onChange} />
          <DefaultText>(по умолчанию: {defaults.value})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
