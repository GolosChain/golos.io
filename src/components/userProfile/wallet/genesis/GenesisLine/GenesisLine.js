import React from 'react';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import tt from 'counterpart';
import is from 'styled-is';

import Icon from 'components/golos-ui/Icon/Icon';
import Linkify from '../../../../common/Linkify';
import TextCut from '../../../../common/TextCut';
import { breakWordStyles } from '../../../../../helpers/styles';

const Root = styled.div`
  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0 20px;
`;

const LineIcon = styled(Icon)`
  flex-shrink: 0;
  width: 24px;
  height: 80px;
  color: ${props => props.color || '#b7b7ba'};
`;

const Who = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 10px;
  padding: 0 16px;
  height: 80px;
  overflow: hidden;
`;

const WhoTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhoName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Memo = styled.div`
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

const MemoIcon = styled(Icon)`
  display: block;
  flex-shrink: 0;
  flex-basis: 24px;
  margin-top: 28px;
  color: #333;
  transition: color 0.15s;

  ${is('text')}:hover {
    color: #3684ff;
  }
`;

const MemoCut = styled(TextCut)`
  flex-grow: 1;
  margin: 15px 0;
  padding: 0 40px;

  @media (min-width: 890px) and (max-width: 1050px), (max-width: 550px) {
    display: none;
  }
`;

const MemoCenter = styled.div`
  &::after {
    display: inline-block;
    content: '';
    height: 50px;
    vertical-align: middle;
  }
`;

const MemoText = styled.div`
  display: inline-block;
  width: 100%;
  padding: 4px 0;
  line-height: 1.4em;
  vertical-align: middle;
  ${breakWordStyles};
`;

const Value = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
  width: auto;
  height: 80px;
  justify-content: center;
`;

const Amount = styled.div`
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

function GenesisLine({ convertion }) {
  const { quantity, memo } = convertion;

  const color = '#2879ff';

  return (
    <Root>
      <Line>
        <LineIcon name="logo" color={color} />
        <Who>
          <WhoName>
            <WhoTitle>{tt('user_wallet.content.conversion')}</WhoTitle>
          </WhoName>
        </Who>
        {memo ? (
          <Memo>
            <MemoIcon name="note" />
            <MemoCut height={55}>
              <MemoCenter>
                <MemoText>
                  <Linkify>{memo}</Linkify>
                </MemoText>
              </MemoCenter>
            </MemoCut>
          </Memo>
        ) : null}
        <Value>
          <Amount color={color}>{quantity}</Amount>
        </Value>
      </Line>
    </Root>
  );
}

export default withRouter(GenesisLine);
