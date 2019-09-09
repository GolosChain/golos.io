import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, fieldsToString, parsePercent, parsePercentString } from 'utils/common';

import ErrorLine from '../../ErrorLine';
import { InputSmall, FieldSubTitle, FunctionParameter } from '../elements';

const Wrapper = styled.div``;

export default class PublishSetRules extends PureComponent {
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

  render() {
    const { fields } = this.props;
    const { mainfunc, curationfunc, timepenalty, maxtokenprop, isInvalid } = this.state;

    return (
      <Wrapper>
        <FieldSubTitle>{fields.mainfunc}:</FieldSubTitle>
        <FunctionParameter
          value={mainfunc}
          onChange={value => this.onFuncChange('mainfunc', value)}
        />
        <FieldSubTitle>{fields.curationfunc}:</FieldSubTitle>
        <FunctionParameter
          value={curationfunc}
          onChange={value => this.onFuncChange('curationfunc', value)}
        />
        <FieldSubTitle>{fields.timepenalty}:</FieldSubTitle>
        <FunctionParameter
          value={timepenalty}
          onChange={value => this.onFuncChange('timepenalty', value)}
        />
        <FieldSubTitle>{fields.maxtokenprop}:</FieldSubTitle>
        <InputSmall
          value={maxtokenprop}
          type="number"
          min="0"
          max="100"
          onChange={this.onMaxTokenPropChange}
        />
        {isInvalid ? <ErrorLine /> : null}
      </Wrapper>
    );
  }
}
