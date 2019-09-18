import React from 'react';
import { withRouter } from 'next/router';
import tt from 'counterpart';

import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import Linkify from 'components/common/Linkify';
import TrxLink from 'components/userProfile/wallet/common/TrxLink';
import TransferLink from '../TransferLink';

import {
  Wrapper,
  Line,
  LineIcon,
  Who,
  WhoName,
  WhoBottom,
  Value,
  Amount,
  Currency,
  TimeStamp,
  Memo,
  MemoIcon,
  MemoCut,
  MemoCenter,
  MemoText,
} from '../../common';

const CURRENCY_COLOR = {
  GOLOS: '#2879ff',
};

function TransferLine({ userId, transfer }) {
  const { memo, quantity, sym, receiver, sender, timestamp, trxId, isIrreversible } = transfer;

  const samePerson = receiver.userId === sender.userId;
  const isSent = sender.userId === userId;
  const isReceive = receiver.userId === userId && !samePerson;

  let color = isReceive ? CURRENCY_COLOR[sym] : null;
  let icon = 'brilliant';
  let tooltipText = null;
  if (!isIrreversible) {
    color = null;
    icon = 'clock';
    tooltipText = tt('g.pending_transaction');
  } else if (sym === 'GOLOS') {
    icon = 'logo';
  }

  const memoIconText = null; // TODO

  const senderId = sender.username || sender.userId;
  const receiverId = receiver.username || receiver.userId;

  return (
    <Wrapper isIrreversible={isIrreversible}>
      <Line>
        <LineIcon name={icon} color={color} data-tooltip={tooltipText} />
        <Who>
          <WhoName>
            {isReceive ? (
              <>
                {tt('user_wallet.content.from')} <TransferLink user={senderId} />
              </>
            ) : null}
            {isSent ? (
              <>
                {tt('user_wallet.content.to')} <TransferLink user={receiverId} />
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
    </Wrapper>
  );
}

export default withRouter(TransferLine);
