import React, { PureComponent } from 'react';

import { defaults, fieldsToString, isPositiveInteger } from 'utils/common';

import { Fields, FieldSubTitle, InputSmall, InputLine, DefaultText, ErrorLine } from '../elements';

export default class CashoutWindow extends PureComponent {
  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

  onWindowChange = e => {
    this.setState(
      {
        window: e.target.value,
      },
      this.triggerChange
    );
  };

  onUpvoteLockoutChange = e => {
    this.setState(
      {
        upvote_lockout: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    if (!isPositiveInteger(this.state.window) || !isPositiveInteger(this.state.upvote_lockout)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    const cashoutWindow = parseInt(this.state.window, 10);
    const lockout = parseInt(this.state.upvote_lockout, 10);

    if (cashoutWindow < 0 || lockout < 0 || cashoutWindow >= lockout) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      window: cashoutWindow,
      upvote_lockout: lockout,
    });
  };

  render() {
    const { fields, defaults } = this.props;
    const { window, upvote_lockout, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.window}</FieldSubTitle>
        <InputLine>
          <InputSmall type="number" value={window} min="0" onChange={this.onWindowChange} />
          <DefaultText>(по умолчанию: {defaults.window})</DefaultText>
        </InputLine>
        <FieldSubTitle>{fields.upvote_lockout}</FieldSubTitle>
        <InputLine>
          <InputSmall
            type="number"
            value={upvote_lockout}
            min="0"
            onChange={this.onUpvoteLockoutChange}
          />
          <DefaultText>(по умолчанию: {defaults.upvote_lockout})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
