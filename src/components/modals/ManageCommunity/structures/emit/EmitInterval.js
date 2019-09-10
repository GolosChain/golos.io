import React, { PureComponent } from 'react';

import { defaults, fieldsToString } from 'utils/common';

import { Fields, InputSmall, ErrorLine, DefaultText, InputLine } from '../elements';

export default class EmitInterval extends PureComponent {
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
    const { defaults } = this.props;
    const { value, isInvalid } = this.state;

    return (
      <Fields>
        <InputLine>
          <InputSmall value={value} onChange={this.onChange} />
          <DefaultText>(по умолчанию: {defaults.value})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
