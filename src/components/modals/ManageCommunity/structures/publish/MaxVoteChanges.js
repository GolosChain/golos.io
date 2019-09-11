import React from 'react';
import PropTypes from 'prop-types';

import { defaults, fieldsToString } from 'utils/common';

import { BaseStructure, InputSmall } from '../elements';

export default class MaxVoteChanges extends BaseStructure {
  static propTypes = {
    actionName: PropTypes.string.isRequired,
    initialValues: PropTypes.shape({}).isRequired,
    fields: PropTypes.shape({}).isRequired,
    defaults: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = fieldsToString(defaults(this.props.initialValues, this.props.defaults));

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

    const value = parseInt(this.state.value, 10);

    if (Number.isNaN(value) || value < 0 || value > 255) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      value,
    });
  };

  renderFields() {
    return this.renderField('value', value => (
      <InputSmall type="number" value={value} min="0" max="255" onChange={this.onChange} />
    ));
  }
}
