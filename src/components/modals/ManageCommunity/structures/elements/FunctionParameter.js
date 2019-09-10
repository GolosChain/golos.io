import React from 'react';
import styled from 'styled-components';

import { Input } from 'components/golos-ui/Form';

const Wrapper = styled.div`
  padding: 1px 12px;
  margin: 8px 0 12px;
  border: 1px solid #999;
  border-radius: 6px;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
`;

const Description = styled.div`
  line-height: 16px;
  margin-right: 10px;
  font-size: 14px;
  color: #333;
`;

export default function FunctionParameter({ value, onChange }) {
  return (
    <Wrapper>
      <Line>
        <Description>Формула:</Description>
        <Input
          value={value.str}
          onChange={e => onChange({ str: e.target.value, maxarg: value.maxarg })}
        />
      </Line>
      <Line>
        <Description>Максимальный аргумент:</Description>
        <Input
          value={value.maxarg}
          type="number"
          min="0"
          onChange={e => onChange({ str: value.str, maxarg: e.target.value })}
        />
      </Line>
    </Wrapper>
  );
}
