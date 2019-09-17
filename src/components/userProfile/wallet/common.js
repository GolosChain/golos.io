import styled from 'styled-components';
import is from 'styled-is';

import { breakWordStyles } from 'helpers/styles';
import Icon from 'components/golos-ui/Icon';
import TextCut from 'components/common/TextCut';

export const Wrapper = styled.div`
  opacity: 0.7;

  ${is('isIrreversible')`
    opacity: 1;
  `};

  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

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

export const WhoTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WhoName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WhoBottom = styled.div`
  display: flex;
  align-items: center;
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

export const TimeStamp = styled.div`
  margin-right: 8px;
  font-size: 12px;
  color: #959595;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Memo = styled.div`
  margin-left: 10px;
  display: flex;
  flex-grow: 1.5;
  flex-basis: 10px;
  overflow: hidden;

  @media (min-width: 890px) and (max-width: 1050px), (max-width: 550px) {
    flex-grow: 0;
    min-width: 24px;
  }
`;

export const MemoIcon = styled(Icon)`
  display: block;
  flex-shrink: 0;
  flex-basis: 24px;
  margin-top: 28px;
  color: #333;
  transition: color 0.15s;

  ${is('text')`
    &:hover {
      color: #3684ff;
    }
  `}
`;

export const MemoCenter = styled.div`
  &::after {
    display: inline-block;
    content: '';
    height: 50px;
    vertical-align: middle;
  }
`;

export const MemoText = styled.div`
  display: inline-block;
  width: 100%;
  padding: 4px 0;
  line-height: 1.4em;
  vertical-align: middle;
  ${breakWordStyles};
`;

export const MemoCut = styled(TextCut)`
  flex-grow: 1;
  margin: 15px 0;
  padding: 0 40px;

  @media (min-width: 890px) and (max-width: 1050px), (max-width: 550px) {
    display: none;
  }
`;
