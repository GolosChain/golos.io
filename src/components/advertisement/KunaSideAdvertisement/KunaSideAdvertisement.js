import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const VARIANTS_COUNT = 3;

const Wrapper = styled.a`
  display: block;
  margin-bottom: 20px;
`;

const Img = styled.img`
  display: block;
  width: 200px;
  height: 400px;
`;

export default function KunaSideAdvertisement() {
  const variant = useRef(Math.floor(Math.random() * VARIANTS_COUNT) + 1);
  const [show, setShow] = useState('show');

  if (show !== 'show') {
    return null;
  }

  return (
    <Wrapper href="https://kuna.io/" target="_blank" rel="noopener noreferrer">
      <Img src={`/kuna/side_${variant.current}.png`} onError={setShow} />
    </Wrapper>
  );
}
