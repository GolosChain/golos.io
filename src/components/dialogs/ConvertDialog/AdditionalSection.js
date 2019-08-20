import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { Checkbox } from 'components/golos-ui/Form';
import Slider from 'components/golos-ui/Slider';

import AccountNameInput from 'components/common/AccountNameInput';

const SliderWrapper = styled.div`
  margin-bottom: 3px;
`;

const Label = styled.div`
  margin-bottom: 9px;
  font-size: 14px;
`;

const Section = styled.div`
  margin: 10px 0;

  ${is('flex')`
    display: flex;
  `};
`;

export default function AdditionalSection({
  balance,
  type,
  types,
  recipient,
  saveTo,
  amount,
  onSaveTypeChange,
  onTargetChange,
  onSliderChange,
}) {
  switch (type) {
    case types.GOLOS:
      return (
        <>
          <Section flex>
            <Checkbox
              title={tt('dialogs_transfer.transfer_check')}
              inline
              value={saveTo}
              onChange={onSaveTypeChange}
            />
          </Section>
          {saveTo ? (
            <Section>
              <Label>{tt('dialogs_transfer.to')}</Label>
              <AccountNameInput
                name="account"
                block
                autoFocus
                placeholder={tt('dialogs_transfer.to_placeholder')}
                value={recipient}
                onChange={onTargetChange}
              />
            </Section>
          ) : null}
        </>
      );
    case types.POWER:
      const cur = Math.round(parseFloat(amount.replace(/\s+/, '')) * 1000) || 0;
      const max = Math.round(balance * 1000);

      return (
        <SliderWrapper>
          <Slider
            value={cur}
            max={max}
            showCaptions
            percentsInCaption
            hideHandleValue
            onChange={onSliderChange}
          />
        </SliderWrapper>
      );
    default:
      return null;
  }
}

AdditionalSection.propTypes = {
  balance: PropTypes.number,
  type: PropTypes.string,
  types: PropTypes.shape({}),
  recipient: PropTypes.string,
  saveTo: PropTypes.bool.isRequired,
  amount: PropTypes.string,
  onSaveTypeChange: PropTypes.func.isRequired,
  onTargetChange: PropTypes.func.isRequired,
  onSliderChange: PropTypes.func.isRequired,
};
