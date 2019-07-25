import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { displayError } from 'utils/toastMessages';
import { Input } from 'components/golos-ui/Form';
import Button from 'components/golos-ui/Button';

const DEFAULT = {
  value: '',
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

export default class SocialAcc extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  onSaveClick = () => {
    const { onChange } = this.props;
    const value = this.state.value.trim();

    if (!value) {
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
        <InputSmall value={value} onChange={this.onChange} />
        <Buttons>
          <SaveButton onClick={this.onSaveClick}>Применить</SaveButton>
        </Buttons>
      </Fields>
    );
  }
}
