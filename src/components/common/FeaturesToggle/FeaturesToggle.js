import React, { useState, memo } from 'react';
import styled from 'styled-components';
import { map } from 'ramda';
import { updateFlags } from '@flopflip/memory-adapter';
import defaultFlags from 'shared/feature-flags';
import Switcher from 'components/golos-ui/Form/components/Switcher';

import useKeyboardEvent from 'utils/hooks/useKeyboardEvent';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;

  margin: 10px;
  padding: 10px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const LabelStyled = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:not(:last-child) {
    margin-bottom: 2px;
  }
`;

const SwitchStyled = styled(Switcher)`
  margin: 5px 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

function FeaturesToggle() {
  const [isShowed, setShow] = useState(false);
  const [isToggled, setToggle] = useState(false);
  const [isToggledDefaults, setToggleDefaults] = useState(false);

  const isEveryFalse = Object.values(defaultFlags).every(flag => !flag);

  // Toggle defaults features
  const onToggleFeaturesDefaults = () => {
    let newFlags = defaultFlags;
    if (!isToggledDefaults) {
      newFlags = map(() => true, defaultFlags);
    }

    updateFlags(newFlags);
    setToggleDefaults(state => !state);
  };

  // Toggle all features
  const onToggleFeatures = () => {
    const newFlags = map(() => !isToggled, defaultFlags);

    updateFlags(newFlags);
    setToggle(state => !state);
  };

  // Do when handle ctrl+f
  useKeyboardEvent('mod+i', () => setShow(state => !state));

  if (!isShowed) {
    return null;
  }

  return (
    <Wrapper>
      {!isEveryFalse && (
        <LabelStyled>
          Turn on defaults
          <SwitchStyled
            value={isToggledDefaults}
            name="features__turn-on-default"
            onChange={onToggleFeaturesDefaults}
          />
        </LabelStyled>
      )}
      <LabelStyled>
        Turn on all
        <SwitchStyled value={isToggled} name="features__turn-on-all" onChange={onToggleFeatures} />
      </LabelStyled>
    </Wrapper>
  );
}

export default memo(FeaturesToggle);
