import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, parsePercent, parsePercentString } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';
import { InputLine, DefaultText } from '../elements';

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

    const { min_curators_prcnt, max_curators_prcnt } = defaults(
      this.props.initialValues,
      this.props.defaults
    );

    this.state = {
      min: parsePercent(min_curators_prcnt),
      max: parsePercent(max_curators_prcnt),
    };
  }

  onMinChange = e => {
    this.setState(
      {
        min: e.target.value,
      },
      this.triggerChange
    );
  };

  onMaxChange = e => {
    this.setState(
      {
        max: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const min = this.state.min.trim();
    const max = this.state.max.trim();

    const min_curators_prcnt = parsePercentString(min);
    const max_curators_prcnt = parsePercentString(max);

    if (
      Number.isNaN(min_curators_prcnt) ||
      Number.isNaN(max_curators_prcnt) ||
      min_curators_prcnt > max_curators_prcnt
    ) {
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
    const { fields, defaults } = this.props;
    const { min, max, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>{fields.min_curators_prcnt}</FieldSubTitle>
        <InputLine>
          <InputSmall type="number" value={min} min="0" max="100" onChange={this.onMinChange} />
          <DefaultText>(по умолчанию: {parsePercent(defaults.min_curators_prcnt)})</DefaultText>
        </InputLine>
        <FieldSubTitle>{fields.max_curators_prcnt}</FieldSubTitle>
        <InputLine>
          <InputSmall type="number" value={max} min="0" max="100" onChange={this.onMaxChange} />
          <DefaultText>(по умолчанию: {parsePercent(defaults.max_curators_prcnt)})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
