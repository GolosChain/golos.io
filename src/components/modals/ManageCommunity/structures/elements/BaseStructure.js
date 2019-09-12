import React, { PureComponent, Fragment } from 'react';

import { FIELD_TYPES } from 'constants/communitySettings';
import { parsePercent, integerToVesting } from 'utils/common';

import { FieldSubTitle, InputLine, DefaultText, Fields, ErrorLine } from './index';

export default class BaseStructure extends PureComponent {
  renderFields() {
    throw new Error('Must be implemented');
  }

  renderField(name, renderer) {
    const { fields, limits, defaults, fieldsTypes } = this.props;

    const fieldName = fields[name];
    const limit = limits[name];
    const originalDef = defaults[name];
    const type = fieldsTypes[name];
    const value = this.state[name];

    let def;

    if (type) {
      switch (type) {
        case FIELD_TYPES.PERCENT:
          def = `${parsePercent(originalDef)}%`;
          break;
        case FIELD_TYPES.INTEGER_VESTING:
          def = integerToVesting(originalDef);
          break;
        default:
          def = originalDef;
      }
    }

    return (
      <Fragment key={name}>
        {fieldName || limit ? (
          <FieldSubTitle>
            {fieldName}
            {limit ? ` ${limit}` : null}:
          </FieldSubTitle>
        ) : null}
        <InputLine>
          {renderer(value)}
          {def ? <DefaultText>(по умолчанию: {def})</DefaultText> : null}
        </InputLine>
      </Fragment>
    );
  }

  render() {
    const { isInvalid } = this.state;

    return (
      <Fields>
        {this.renderFields()}
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
