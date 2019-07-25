import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { displayError } from 'utils/toastMessages';
import { Input } from 'components/golos-ui/Form';
import Button from 'components/golos-ui/Button';

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

const Buttons = styled.div`
  margin-top: 8px;
`;

const SaveButton = styled(Button)``;

export default class CuratorPercent extends PureComponent {
  state = {
    cashoutWindow: 120,
    lockout: 0,
  };

  onWindowChange = e => {
    this.setState({
      cashoutWindow: e.target.value,
    });
  };

  onUpvoteLockoutChange = e => {
    this.setState({
      lockout: e.target.value,
    });
  };

  onSaveClick = () => {
    const { onChange } = this.props;
    const { cashoutWindow, lockout } = this.state;

    const nWindow = parseInt(cashoutWindow, 10);
    const nLockout = parseInt(lockout, 10);

    if (Number.isNaN(nWindow) || Number.isNaN(nLockout) || nWindow < 0 || nLockout < 0) {
      displayError('Введены некорректные значения');
      return;
    }

    onChange({
      window: nWindow,
      upvote_lockout: nLockout,
    });
  };

  render() {
    const { cashoutWindow, lockout } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Окно (сек)</FieldSubTitle>
        <InputSmall type="number" value={cashoutWindow} min="0" onChange={this.onWindowChange} />
        <FieldSubTitle>Upvote Lockout (сек)</FieldSubTitle>
        <InputSmall type="number" value={lockout} min="0" onChange={this.onUpvoteLockoutChange} />
        <Buttons>
          <SaveButton onClick={this.onSaveClick}>Save</SaveButton>
        </Buttons>
      </Fields>
    );
  }
}
