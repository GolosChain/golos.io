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
    cashoutWindow: 25,
    lockout: 75,
  };

  onCurationMinChange = e => {
    this.setState({
      cashoutWindow: e.target.value,
    });
  };

  onCurationMaxChange = e => {
    this.setState({
      lockout: e.target.value,
    });
  };

  onSaveClick = () => {
    const { onChange } = this.props;
    const { curatorMin, curatorMax } = this.state;

    const min = parseInt(curatorMin, 10);
    const max = parseInt(curatorMax, 10);

    if (Number.isNaN(min) || Number.isNaN(max) || min > max || min < 0 || max > 100) {
      displayError('Введены некорректные значения');
      return;
    }

    onChange({
      min_curators_prcnt: min * 100,
      max_curators_prcnt: max * 100,
    });
  };

  render() {
    const { curatorMin, curatorMax } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Минимум (%)</FieldSubTitle>
        <InputSmall
          type="number"
          value={curatorMin}
          min="0"
          max="100"
          onChange={this.onCurationMinChange}
        />
        <FieldSubTitle>Максимум (%)</FieldSubTitle>
        <InputSmall
          type="number"
          value={curatorMax}
          min="0"
          max="100"
          onChange={this.onCurationMaxChange}
        />
        <Buttons>
          <SaveButton onClick={this.onSaveClick}>Save</SaveButton>
        </Buttons>
      </Fields>
    );
  }
}
