import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import { InputLine, DefaultText, ErrorLine } from '../elements';

const Fields = styled.label`
  text-transform: none;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

export default class MaxBeneficiaries extends PureComponent {
  state = defaults(this.props.initialValues, this.props.defaults);

  onChange = e => {
    this.setState(
      {
        value: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const { value } = this.state;

    const valueNumber = parseInt(value, 10);

    if (Number.isNaN(valueNumber) || valueNumber < 0 || valueNumber > 255) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      value: valueNumber,
    });
  };

  render() {
    const { defaults } = this.props;
    const { value, isInvalid } = this.state;

    return (
      <Fields>
        <InputLine>
          <InputSmall type="number" value={value} min="0" max="255" onChange={this.onChange} />
          <DefaultText>(по умолчанию: {defaults.value})</DefaultText>
        </InputLine>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
