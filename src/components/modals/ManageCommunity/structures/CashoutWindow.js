import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../ErrorLine';

const Fields = styled.label`
  text-transform: none;
`;

const FieldSubTitle = styled.h3`
  display: block;
  margin-top: 4px;
  font-size: 15px;
  font-weight: normal;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

const DEFAULT = {
  window: 120,
  upvote_lockout: 15,
};

export default class CashoutWindow extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

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

    const cashoutWindow = parseInt(this.state.window, 10);
    const lockout = parseInt(this.state.upvote_lockout, 10);

    if (Number.isNaN(cashoutWindow) || Number.isNaN(lockout) || cashoutWindow < 0 || lockout < 0) {
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
    const { window, upvote_lockout, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Окно (сек)</FieldSubTitle>
        <InputSmall type="number" value={window} min="0" onChange={this.onWindowChange} />
        <FieldSubTitle>Upvote Lockout (сек)</FieldSubTitle>
        <InputSmall
          type="number"
          value={upvote_lockout}
          min="0"
          onChange={this.onUpvoteLockoutChange}
        />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
