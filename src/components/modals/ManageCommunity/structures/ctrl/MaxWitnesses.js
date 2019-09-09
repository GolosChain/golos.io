import React, { PureComponent } from 'react';

import { defaults, fieldsToString } from 'utils/common';

import { Fields, InputLine, DefaultText, InputSmall, ErrorLine } from '../elements';

export default class MaxWitnesses extends PureComponent {
  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

  onChange = e => {
    this.setState(
      {
        max: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const max = parseInt(this.state.max, 10);

    if (!max || Number.isNaN(max)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      max,
    });
  };

  render() {
    const { defaults } = this.props;
    const { max, isInvalid } = this.state;

    return (
      <Fields>
        <InputLine>
          <InputSmall value={max} onChange={this.onChange} />
          <DefaultText>(по умолчанию: {defaults.max})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
