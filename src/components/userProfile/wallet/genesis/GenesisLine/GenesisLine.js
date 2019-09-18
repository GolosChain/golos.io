import React from 'react';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import tt from 'counterpart';

import Linkify from 'components/common/Linkify';

import {
  Line,
  LineIcon,
  Who,
  WhoTitle,
  WhoName,
  Value,
  Amount,
  Memo,
  MemoIcon,
  MemoCenter,
  MemoText,
  MemoCut,
} from '../../common';

const Wrapper = styled.div`
  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

function GenesisLine({ convertion }) {
  const { quantity, memo } = convertion;

  const color = '#2879ff';

  return (
    <Wrapper>
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
    </Wrapper>
  );
}

export default withRouter(GenesisLine);
