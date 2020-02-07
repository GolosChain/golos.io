import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { cardStyle, EntryWrapper } from 'components/cards/common';

const BIG_VARIANTS_COUNT = 2;
const MOBILE_VARIANTS_COUNT = 3;

const Wrapper = styled(EntryWrapper).attrs({ as: 'a' })`
  position: relative;
  display: block;
  ${cardStyle};
  width: 100%;
  overflow: hidden;
  padding-bottom: 16.666667%; /* pre-format for 900x150 */

  ${is('isMobile')`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 400px;
    padding-bottom: 0;
  `};
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
`;

const MobileImage = styled.img`
  display: block;
`;

export default function KunaMainAdvertisement({ isMobile }) {
  const variant = useRef(Math.floor(Math.random() * 1000));
  const [show, setShow] = useState('show');

  if (show !== 'show') {
    return null;
  }

  return (
    <Wrapper isMobile={isMobile} href="https://kuna.io/" target="_blank" rel="noopener noreferrer">
      {isMobile ? (
        <MobileImage
          src={`/kuna/side_${(variant.current % MOBILE_VARIANTS_COUNT) + 1}.png`}
          onError={setShow}
        />
      ) : (
        <Image
          src={`/kuna/main_${(variant.current % BIG_VARIANTS_COUNT) + 1}.png`}
          onError={setShow}
        />
      )}
    </Wrapper>
  );
}
