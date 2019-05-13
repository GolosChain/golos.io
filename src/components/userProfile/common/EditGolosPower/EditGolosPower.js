import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import Slider from 'components/golos-ui/Slider';
import ComplexInput from 'components/golos-ui/ComplexInput';
import { parseAmount3 } from 'helpers/currency';

const Root = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 28px;
  background: #fff;
`;

const Field = styled.div`
  margin: 8px 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;

const Button = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  align-items: center;
  flex-basis: 140px;
  padding: 4px 0;
  margin: 0 16px;
  font-size: 13px;
  color: #aaa;
  transition: color 0.15s;
  cursor: pointer;
  outline: none;

  ${is('right')`
    justify-content: flex-end;
  `};

  &:hover {
    color: #333;
  }

  &[disabled] {
    color: #aaa;
    cursor: not-allowed;
  }
`;

const DelegationEditButtonIcon = styled(Icon)`
  ${props => (props.right ? 'margin-left' : 'margin-right')}: 10px;
`;

const DelegationEditSplitter = styled.div`
  width: 1px;
  height: 16px;
  background: #bbb;
`;

export default class EditGolosPower extends PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  state = {
    inputValue: (this.props.value / 1000).toFixed(3),
  };

  render() {
    const { max } = this.props;
    const { inputValue } = this.state;

    const { value, error } = parseAmount3(inputValue, max, false, 1000);

    const isError = Boolean(error);

    return (
      <Root>
        <Field>
          <ComplexInput
            placeholder={tt('dialogs_transfer.amount_placeholder', {
              amount: max.toFixed(3),
            })}
            spellCheck="false"
            autoFocus
            error={isError ? 1 : 0}
            value={inputValue}
            activeId="power"
            buttons={[{ id: 'power', title: 'СГ' }]}
            onChange={this._onValueChange}
          />
        </Field>
        <Field>
          <Slider
            value={value || 0}
            min={10}
            max={max}
            hideHandleValue
            onChange={this._onDelegationSliderChange}
          />
        </Field>
        <Footer>
          <Button disabled={isError} right={1} onClick={isError ? null : this._onSaveClick}>
            {tt('g.save')}
            <DelegationEditButtonIcon name="check" right={1} size={16} />
          </Button>
          <DelegationEditSplitter />
          <Button onClick={this.props.onCancel}>
            <DelegationEditButtonIcon name="cross" size={13} />
            {tt('g.cancel')}
          </Button>
        </Footer>
      </Root>
    );
  }

  _onDelegationSliderChange = value => {
    this.setState({
      inputValue: (value / 1000).toFixed(3),
    });
  };

  _onValueChange = e => {
    this.setState({
      inputValue: e.target.value.replace(/[^\d .]+/g, '').replace(/,/g, '.'),
    });
  };

  _onSaveClick = () => {
    const { max } = this.props;
    const { inputValue } = this.state;

    const { value, error } = parseAmount3(inputValue, max, false, 1000);

    if (!error) {
      this.props.onSave(value);
    }
  };
}
