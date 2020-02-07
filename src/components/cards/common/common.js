import styled, { css } from 'styled-components';

import { breakWordStyles } from 'helpers/styles';

export const EntryWrapper = styled.div`
  margin-bottom: 16px;
`;

export const cardStyle = css`
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 500px) {
    border-radius: 0;
  }
`;

export const PostTitle = styled.h3`
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 36.4px;
  color: #343434;
  max-width: 100%;
  ${breakWordStyles};

  @media (max-width: 900px) {
    font-size: 1.4375rem;
    line-height: 32.4px;
  }
`;

export const PostContent = styled.div`
  font-size: 1rem;
  line-height: 1.56;
  color: #333;
  overflow: hidden;
  ${breakWordStyles};
`;
