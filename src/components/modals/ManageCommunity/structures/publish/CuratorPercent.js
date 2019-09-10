import React, { PureComponent } from 'react';

import { defaults, parsePercent, parsePercentString } from 'utils/common';

import { Fields, FieldSubTitle, InputSmall, InputLine, DefaultText, ErrorLine } from '../elements';

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
