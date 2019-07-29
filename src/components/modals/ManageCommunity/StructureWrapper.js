import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.li`
  margin: 10px 0 20px;
`;

const StructureLine = styled.div``;

const StructureName = styled.h2`
  display: inline-block;
  font-size: 18px;
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
