import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';

export const Line = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

export const LineIcon = styled(Icon)`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${props => props.color || '#b7b7ba'};
`;

export const Who = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 10px;
  padding: 0 16px;
  height: 80px;
  overflow: hidden;
`;

export const WhoName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Value = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  flex-basis: 150px;
  align-items: flex-end;
  width: auto;
  height: 80px;
  justify-content: center;
`;

export const Amount = styled.div`
  margin-top: 2px;
  line-height: 24px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.color || '#b7b7ba'};
  white-space: nowrap;
  overflow: hidden;

  @media (min-width: 890px) and (max-width: 1023px), (max-width: 639px) {
    font-size: 18px;
  }
`;

export const Currency = styled.div`
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
`;
