import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Icon from 'components/golos-ui/Icon';
import HintIcon from 'components/elements/common/HintIcon/HintIcon';

export default class RadioGroup extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { options, name, value, className, disabled } = this.props;

    return (
      <div className={cn('RadioGroup', { RadioGroup_disabled: disabled }, className)}>
        {options.map(item => (
          <div key={item.id} className="RadioGroup__item">
            <label
              className="RadioGroup__label"
              onClick={disabled ? null : () => this._onItemClick(item)}
            >
              <input
                type="radio"
                name={name}
                className="RadioGroup__input"
                disabled={disabled}
                checked={item.id === value}
                onChange={noop}
              />
              <Icon
                name={item.id === value ? 'radio-on' : 'radio-off'}
                className={cn('RadioGroup__svg-wrapper', {
                  'RadioGroup__svg-wrapper_value': item.id === value,
                })}
              />
              <span className="RadioGroup__label-text">{item.title}</span>
            </label>
            {item.hint ? (
              <span className="RadioGroup__hint">
                <HintIcon hint={item.hint} />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  _onItemClick = item => {
    this.props.onChange(item.id);
  };
}

function noop() {}
