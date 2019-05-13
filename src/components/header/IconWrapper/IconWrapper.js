import styled from 'styled-components';

export default styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
  user-select: none;

  @media (max-width: 500px) {
    margin-left: 0;
    margin-right: 0;
  }
`;
