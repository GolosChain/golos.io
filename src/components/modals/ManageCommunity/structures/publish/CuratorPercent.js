import React from 'react';

import { defaults, parsePercent, parsePercentString } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class CuratorPercent extends BaseStructure {
  constructor(props) {
    super(props);

    const { min_curators_prcnt, max_curators_prcnt } = defaults(
      this.props.initialValues,
      this.props.defaults
    );

    this.state = {
      min_curators_prcnt: parsePercent(min_curators_prcnt),
      max_curators_prcnt: parsePercent(max_curators_prcnt),
    };
  }

  onMinChange = e => {
    this.setState(
      {
        min_curators_prcnt: e.target.value,
      },
      this.triggerChange
    );
  };

  onMaxChange = e => {
    this.setState(
      {
        max_curators_prcnt: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;

    const min = this.state.min_curators_prcnt.trim();
    const max = this.state.max_curators_prcnt.trim();

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

  renderFields() {
    return [
      this.renderField('min_curators_prcnt', value => (
        <InputSmall type="number" value={value} min="0" max="100" onChange={this.onMinChange} />
      )),
      this.renderField('max_curators_prcnt', value => (
        <InputSmall type="number" value={value} min="0" max="100" onChange={this.onMaxChange} />
      )),
    ];
  }
}
