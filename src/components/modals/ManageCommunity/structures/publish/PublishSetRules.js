import React from 'react';

import { defaults, fieldsToString, parsePercent, parsePercentString } from 'utils/common';

import { BaseStructure, InputSmall, FunctionParameter } from '../elements';

export default class PublishSetRules extends BaseStructure {
  constructor(props) {
    super(props);

    const state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

    state.maxtokenprop = parsePercent(state.maxtokenprop);

    this.state = state;
  }

  onFuncChange = (fieldName, value) => {
    this.setState(
      {
        [fieldName]: value,
      },
      this.triggerChange
    );
  };

  onMaxTokenPropChange = e => {
    this.setState(
      {
        maxtokenprop: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const { mainfunc, curationfunc, timepenalty, maxtokenprop } = this.state;

    const maxtokenpropParsed = parsePercentString(maxtokenprop);

    if (
      !mainfunc.str.trim() ||
      !curationfunc.str.trim() ||
      !timepenalty.str.trim() ||
      Number.isNaN(maxtokenpropParsed)
    ) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      mainfunc,
      curationfunc,
      timepenalty,
      maxtokenprop: maxtokenpropParsed,
    });
  };

  renderFields() {
    return [
      this.renderField('mainfunc', value => (
        <FunctionParameter value={value} onChange={value => this.onFuncChange('mainfunc', value)} />
      )),
      this.renderField('curationfunc', value => (
        <FunctionParameter
          value={value}
          onChange={value => this.onFuncChange('curationfunc', value)}
        />
      )),
      this.renderField('timepenalty', value => (
        <FunctionParameter
          value={value}
          onChange={value => this.onFuncChange('timepenalty', value)}
        />
      )),
      this.renderField('maxtokenprop', value => (
        <InputSmall
          value={value}
          type="number"
          min="0"
          max="100"
          onChange={this.onMaxTokenPropChange}
        />
      )),
    ];
  }
}
