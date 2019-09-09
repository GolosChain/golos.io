import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults } from 'utils/common';
import { Input } from 'components/golos-ui/Form';

import ErrorLine from '../elements/ErrorLine';

const DEFAULT = {
  code: '',
};

const Fields = styled.label`
  text-transform: none;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

export default class CtrlToken extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onChange = e => {
    this.setState(
      {
        code: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const code = this.state.code.trim();

    if (!code) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      code,
    });
  };

  render() {
    const { code, isInvalid } = this.state;

    return (
      <Fields>
        <InputSmall value={code} onChange={this.onChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
