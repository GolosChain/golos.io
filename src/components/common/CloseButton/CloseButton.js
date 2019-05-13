import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  line-height: 1;
  font-size: 2em;
  color: #8a8a8a;
  cursor: pointer;
`;

const ButtonInner = styled.span``;

export default function CloseButton() {
  return (
    <Button>
      <ButtonInner aria-hidden="true">×</ButtonInner>
    </Button>
  );
}
