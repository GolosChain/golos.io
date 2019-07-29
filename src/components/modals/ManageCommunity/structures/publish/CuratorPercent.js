import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, isPositiveInteger, fieldsToString } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

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
  state = fieldsToString(defaults(this.props.initialValues, DEFAULT));

  onCurationMinChange = e => {
    this.setState(
      {
        min_curators_prcnt: e.target.value,
      },
      this.triggerChange
    );
  };

  onCurationMaxChange = e => {
    this.setState(
      {
        max_curators_prcnt: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const min_curators_prcnt = this.state.min_curators_prcnt.trim();
    const max_curators_prcnt = this.state.max_curators_prcnt.trim();

    if (!isPositiveInteger(min_curators_prcnt) || !isPositiveInteger(max_curators_prcnt)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    const min = Number(min_curators_prcnt);
    const max = Number(max_curators_prcnt);

    if (min < 0 || max > 10000 || max < min) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      min_curators_prcnt,
      max_curators_prcnt,
    });
  };

  render() {
    const { min_curators_prcnt, max_curators_prcnt, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Минимум (%)</FieldSubTitle>
        <InputSmall
          type="number"
          value={min_curators_prcnt}
          min="0"
          max="10000"
          onChange={this.onCurationMinChange}
        />
        <FieldSubTitle>Максимум (%)</FieldSubTitle>
        <InputSmall
          type="number"
          value={max_curators_prcnt}
          min="0"
          max="10000"
          onChange={this.onCurationMaxChange}
        />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
