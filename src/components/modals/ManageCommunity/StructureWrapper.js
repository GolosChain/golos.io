import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.li`
  margin: 10px 0 20px;
`;

const StructureLine = styled.div`
  display: flex;
`;

const StructureName = styled.h2`
  font-size: 18px;
`;

const HasChanges = styled.span`
  margin-left: 8px;
`;

export default function StructureWrapper({ title, hasChanges, children }) {
  return (
    <Wrapper>
      <StructureLine>
        <StructureName>{title}</StructureName>
        {hasChanges ? <HasChanges>(has changes)</HasChanges> : null}
      </StructureLine>
      {children}
    </Wrapper>
  );
}
