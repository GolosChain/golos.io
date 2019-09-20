import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { map } from 'ramda';
import flopFlip, { updateFlags } from '@flopflip/memory-adapter';
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
  const [isToggled, setToggle] = useState(
    process.browser ? Boolean(localStorage['ALL_FEATURES']) : false
  );

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    useEffect(() => {
      if (isToggled) {
        flopFlip.waitUntilConfigured().then(() => {
          updateFlags(map(() => true, defaultFlags));
        });
      }
    }, []);
  }

  // Toggle all features
  const onToggleFeatures = () => {
    setToggle(state => {
      const isToggled = !state;

      let flags;

      if (isToggled) {
        flags = map(() => true, defaultFlags);
      } else {
        flags = defaultFlags;
      }

      if (isDev && process.browser) {
        localStorage['ALL_FEATURES'] = isToggled ? 'true' : '';
      }

      updateFlags(flags);

      return isToggled;
    });
  };

  // Do when handle ctrl+f
  useKeyboardEvent('mod+i', () => setShow(state => !state));

  if (!isShowed) {
    return null;
  }

  return (
    <Wrapper>
      <LabelStyled>
        Turn on all
        <SwitchStyled value={isToggled} name="features__turn-on-all" onChange={onToggleFeatures} />
      </LabelStyled>
    </Wrapper>
  );
}

export default memo(FeaturesToggle);
