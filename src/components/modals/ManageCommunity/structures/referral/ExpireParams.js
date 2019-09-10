import React, { PureComponent } from 'react';

import { defaults } from 'utils/common';

import { Fields, InputSmall, ErrorLine } from '../elements';

const DEFAULT = {
  max_expire: '10000000',
};

export default class ExpireParams extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onChange = e => {
    this.setState(
      {
        max_expire: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const max_expire = this.state.max_expire.trim();

    if (!max_expire || !/^\d+$/.test(max_expire)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      max_expire,
    });
  };

  render() {
    const { max_expire, isInvalid } = this.state;

    return (
      <Fields>
        <InputSmall value={max_expire} onChange={this.onChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
