import React from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import { breakWordStyles } from 'helpers/styles';
import Icon from 'components/golos-ui/Icon';
import TextCut from 'components/common/TextCut';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import Linkify from 'components/common/Linkify';
import TrxLink from 'components/userProfile/wallet/common/TrxLink';
import { CURRENCY } from '../../Transfers';

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

const WhoName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhoLink = styled.a`
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhoBottom = styled.div`
  display: flex;
  align-items: center;
`;

const TimeStamp = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #959595;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
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

  ${is('text')`
    &:hover {
      color: #3684ff;
    }
  `}
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

const Currency = styled.div`
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
`;

const CURRENCY_COLOR = {
  GOLOS: '#2879ff',
};

function TransferLine({
  router: {
    query: { userId },
  },
  transfer,
}) {
  const { memo, quantity, sym, receiver, sender, timestamp, trxId } = transfer;

  const samePerson = receiver.userId === sender.userId;
  const isSent = sender.userId === userId;
  const isReceive = receiver.userId === userId && !samePerson;

  const icon = sym === 'GOLOS' ? 'logo' : 'brilliant';
  const color = isReceive ? CURRENCY_COLOR[sym] : null;

  const memoIconText = null; // TODO

  return (
    <Root>
      <Line>
        <LineIcon name={icon} color={color} />
        <Who>
          <WhoName>
            {isReceive ? (
              <>
                {tt('user_wallet.content.from')}{' '}
                <Link href={`/@${sender.userId}`} passHref>
                  <WhoLink>@{sender.userId}</WhoLink>
                </Link>
              </>
            ) : null}
            {isSent ? (
              <>
                {tt('user_wallet.content.to')}{' '}
                <Link href={`/@${receiver.userId}`} passHref>
                  <WhoLink>@{receiver.userId}</WhoLink>
                </Link>
              </>
            ) : null}
          </WhoName>
          <WhoBottom>
            <TimeStamp>
              <TimeAgoWrapper date={timestamp} />
            </TimeStamp>
            <TrxLink trxId={trxId} />
          </WhoBottom>
        </Who>
        {memo ? (
          <Memo>
            <MemoIcon name="note" text={memoIconText} data-hint={memoIconText} />
            <MemoCut height={50}>
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
          <Currency>{sym}</Currency>
        </Value>
      </Line>
    </Root>
  );
}

export default withRouter(TransferLine);
