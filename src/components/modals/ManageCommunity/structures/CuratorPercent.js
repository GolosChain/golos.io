import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../ErrorLine';

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

export default class CuratorPercent extends PureComponent {
  constructor(props) {
    super(props);

    const initial = defaults(props.initialValues, DEFAULT);

    this.state = {
      min: String(initial.min_curators_prcnt / 100),
      max: String(initial.max_curators_prcnt / 100),
      isInvalid: false,
    };
  }

  onCurationMinChange = e => {
    this.setState(
      {
        min: e.target.value,
      },
      this.triggerChange
    );
  };

  onCurationMaxChange = e => {
    this.setState(
      {
        max: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const min = parseInt(this.state.min, 10);
    const max = parseInt(this.state.max, 10);

    if (Number.isNaN(min) || Number.isNaN(max) || min > max || min < 0 || max > 100) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      min_curators_prcnt: min * 100,
      max_curators_prcnt: max * 100,
    });
  };

  render() {
    const { min, max, isInvalid } = this.state;

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
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
