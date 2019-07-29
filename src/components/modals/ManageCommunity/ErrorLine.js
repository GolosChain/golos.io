import React from 'react';
import styled from 'styled-components';

const ErrorLine = styled.div`
  margin-top: 6px;
  color: #f00;
`;

export default () => <ErrorLine>В одном из полей введены некорректные данные</ErrorLine>;
