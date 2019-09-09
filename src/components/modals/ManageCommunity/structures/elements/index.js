import React from 'react';
import styled from 'styled-components';

import { Input } from 'components/golos-ui/Form';

export { default as FunctionParameter } from './FunctionParameter';
export { default as ErrorLine } from './ErrorLine';

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
  margin-top: 6px;
  line-height: 20px;
  font-size: 15px;
  font-weight: normal;
`;

export const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;
