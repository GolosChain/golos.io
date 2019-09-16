import React from 'react';

import { defaults, fieldsToString, isPositiveInteger } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class CashoutWindow extends BaseStructure {
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

    if (cashoutWindow < 0 || lockout < 0 || cashoutWindow < lockout) {
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

  renderFields() {
    return [
      this.renderField('window', value => (
        <InputSmall type="number" value={value} min="0" onChange={this.onWindowChange} />
      )),
      this.renderField('upvote_lockout', value => (
        <InputSmall type="number" value={value} min="0" onChange={this.onUpvoteLockoutChange} />
      )),
    ];
  }
}
