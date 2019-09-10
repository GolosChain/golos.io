import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.li`
  margin: 10px 0 20px;
  list-style: none;
`;

const StructureLine = styled.div`
  margin-bottom: 6px;
`;

const StructureName = styled.h4`
  display: inline-block;
  font-size: 16px;
`;

export default function StructureWrapper({ title, hasChanges, children }) {
  return (
    <Wrapper>
      <StructureLine>
        <StructureName>{title}</StructureName> {hasChanges ? '(has changes)' : null}
      </StructureLine>
      {children}
    </Wrapper>
  );
}
