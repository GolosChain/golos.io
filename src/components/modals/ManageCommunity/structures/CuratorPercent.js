import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { displayError } from 'utils/toastMessages';
import { Input } from 'components/golos-ui/Form';
import Button from 'components/golos-ui/Button';

const DEFAULT = {
  min_curators_prcnt: 2500,
  max_curators_prcnt: 7500,
};

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
  constructor(props) {
    super(props);

    const initial = defaults(props.initialValues, DEFAULT);

    this.state = {
      min: String(initial.min_curators_prcnt / 100),
      max: String(initial.max_curators_prcnt / 100),
    };
  }

  onCurationMinChange = e => {
    this.setState({
      min: e.target.value,
    });
  };

  onCurationMaxChange = e => {
    this.setState({
      max: e.target.value,
    });
  };

  onSaveClick = () => {
    const { onChange } = this.props;

    const min = parseInt(this.state.min, 10);
    const max = parseInt(this.state.max, 10);

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
    const { min, max } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Минимум (%)</FieldSubTitle>
        <InputSmall
          type="number"
          value={min}
          min="0"
          max="100"
          onChange={this.onCurationMinChange}
        />
        <FieldSubTitle>Максимум (%)</FieldSubTitle>
        <InputSmall
          type="number"
          value={max}
          min="0"
          max="100"
          onChange={this.onCurationMaxChange}
        />
        <Buttons>
          <SaveButton onClick={this.onSaveClick}>Применить</SaveButton>
        </Buttons>
      </Fields>
    );
  }
}
