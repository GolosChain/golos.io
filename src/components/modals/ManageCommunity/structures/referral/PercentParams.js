import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, parsePercent, parsePercentString } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  max_percent: 5000,
};

const Fields = styled.label`
  text-transform: none;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

export default class PercentParams extends PureComponent {
  constructor(props) {
    super(props);

    const values = defaults(props.initialValues, DEFAULT);

    this.state = {
      max_percent: parsePercent(values.max_percent),
    };
  }

  onChange = e => {
    this.setState(
      {
        max_percent: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const max_percent = parsePercentString(this.state.max_percent);

    if (!max_percent) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      max_percent,
    });
  };

  render() {
    const { max_percent, isInvalid } = this.state;

    return (
      <Fields>
        <InputSmall value={max_percent} onChange={this.onChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
