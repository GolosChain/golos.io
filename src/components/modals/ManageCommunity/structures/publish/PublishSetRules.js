import React, { Fragment } from 'react';
import styled from 'styled-components';

import { defaults, fieldsToString, parsePercent, parsePercentString } from 'utils/common';
import { Select } from 'components/golos-ui/Form';

import { BaseStructure, InputSmall, InputLine, FieldSubTitle } from '../elements';

const SelectStyled = styled(Select)`
  max-width: 350px;
`;

const AUTHOR_FUNCS = [
  {
    value: 'x',
    text: 'x [линейная]',
  },
  {
    value: '(x / 4294967296)^2',
    text: 'x^2 [квадратичная]',
  },
  {
    value: '((x + 4000000000000) / (x + 8000000000000)) * (x / 4096)',
    text: '((x+s)^2 - s^2) / (x + 4s) [сходящаяся линейная]',
  },
];

const CURATION_FUNCS = [
  {
    value: 'x',
    text: 'x [линейная]',
  },
  {
    value: 'sqrt(x)',
    text: 'sqrt(x) [квадратный корень]',
  },
];

export default class PublishSetRules extends BaseStructure {
  constructor(props) {
    super(props);

    const state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

    state.maxtokenprop = parsePercent(state.maxtokenprop);
    state.timePenaltyStatus = state.timepenalty.str === '1' ? 'off' : 'on';
    state.timePenaltyDuration = String(state.timepenalty.maxarg);

    this.state = state;
  }

  onFuncChange = (fieldName, e) => {
    this.setState(
      {
        [fieldName]: {
          str: e.target.value,
          maxarg: '2251799813685247',
        },
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

  onTimePenaltyStatusChange = e => {
    const status = e.target.value;

    this.setState(
      {
        timePenaltyStatus: status,
      },
      this.updateTimePenalty
    );
  };

  onTimePenaltyChange = e => {
    this.setState(
      {
        timePenaltyDuration: e.target.value,
      },
      this.updateTimePenalty
    );
  };

  updateTimePenalty = () => {
    const { timePenaltyStatus, timePenaltyDuration } = this.state;

    this.setState(
      {
        timepenalty: {
          str: timePenaltyStatus === 'on' ? `t/${timePenaltyDuration}` : '1',
          maxarg: timePenaltyStatus === 'on' ? timePenaltyDuration : '1',
        },
      },
      this.triggerChange
    );
  };

  renderTimePenalty() {
    const { timePenaltyStatus, timePenaltyDuration } = this.state;

    return (
      <Fragment key="timepenalty">
        <FieldSubTitle>Штрафное окно:</FieldSubTitle>
        <InputLine>
          <SelectStyled value={timePenaltyStatus} onChange={this.onTimePenaltyStatusChange}>
            <option value="off">без штрафа</option>
            <option value="on">установить длительность</option>
          </SelectStyled>
        </InputLine>
        {timePenaltyStatus === 'on' ? (
          <>
            <FieldSubTitle>Длительность (сек):</FieldSubTitle>
            <InputLine>
              <InputSmall value={timePenaltyDuration} onChange={this.onTimePenaltyChange} />
            </InputLine>
          </>
        ) : null}
      </Fragment>
    );
  }

  renderFields() {
    return [
      this.renderField('mainfunc', value => (
        <SelectStyled value={value.str} onChange={value => this.onFuncChange('mainfunc', value)}>
          {AUTHOR_FUNCS.map(({ value, text }) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </SelectStyled>
      )),
      this.renderField('curationfunc', value => (
        <SelectStyled
          value={value.str}
          onChange={value => this.onFuncChange('curationfunc', value)}
        >
          {CURATION_FUNCS.map(({ value, text }) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </SelectStyled>
      )),
      this.renderTimePenalty(),
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
