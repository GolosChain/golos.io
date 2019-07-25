import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { displayError } from 'utils/toastMessages';
import { Input } from 'components/golos-ui/Form';
import Button from 'components/golos-ui/Button';

const DEFAULT = {
  value: 3,
};

const Fields = styled.label`
  text-transform: none;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

const Buttons = styled.div`
  margin-top: 8px;
`;

const SaveButton = styled(Button)``;

export default class MaxVoteChanges extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  onSaveClick = () => {
    const { onChange } = this.props;

    const value = parseInt(this.state.value, 10);

    if (Number.isNaN(value) || value < 0 || value > 255) {
      displayError('Введены некорректные значения');
      return;
    }

    onChange({
      value,
    });
  };

  render() {
    const { value } = this.state;

    return (
      <Fields>
        <InputSmall type="number" value={value} min="0" max="255" onChange={this.onChange} />
        <Buttons>
          <SaveButton onClick={this.onSaveClick}>Применить</SaveButton>
        </Buttons>
      </Fields>
    );
  }
}
