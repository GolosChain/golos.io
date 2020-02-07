import React, { useState, useRef } from 'react';
import styled from 'styled-components';

import { cardStyle, EntryWrapper } from 'components/cards/common';

const VARIANTS_COUNT = 2;

const Wrapper = styled(EntryWrapper)`
  position: relative;
  ${cardStyle};
  overflow: hidden;
  padding-bottom: 16.666667%; /* pre-format for 900x150 */
`;

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
`;

export default function KunaMainAdvertisement() {
  const variant = useRef(Math.floor(Math.random() * VARIANTS_COUNT) + 1);
  const [show, setShow] = useState('show');

  if (show !== 'show') {
    return null;
  }

  return (
    <Wrapper>
      <Img src={`/kuna/main_${variant.current}.png`} onError={setShow} />
    </Wrapper>
  );
}
