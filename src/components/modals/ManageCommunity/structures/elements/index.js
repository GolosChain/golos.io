import React from 'react';
import styled from 'styled-components';

import { Input } from 'components/golos-ui/Form';

export { Input } from 'components/golos-ui/Form';
export { default as BaseStructure } from './BaseStructure';
export { default as FunctionParameter } from './FunctionParameter';
export { default as ErrorLine } from './ErrorLine';

export const Fields = styled.label`
  text-transform: none;
`;

export const InputLine = styled.div`
  display: flex;
  align-items: center;
`;

export const DefaultText = styled.div`
  margin-left: 10px;
  font-size: 15px;
  color: #404040;
`;

export const FieldSubTitle = styled.h3`
  display: block;
  margin: 8px 0 4px;
  line-height: 20px;
  font-size: 15px;
  font-weight: normal;
`;

export const InputSmall = styled(Input)`
  width: 140px;
  padding-right: 4px;
`;
