import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { fetchLeaders } from 'store/actions/gate';
import { displayError } from 'utils/toastMessages';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import DialogManager from 'components/elements/common/DialogManager';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import WitnessHeader from 'components/witness/WitnessHeader';
import WitnessesLine, { lineTemplate } from 'components/witness/WitnessesLine';
import Button from 'components/golos-ui/Button';

const WrapperForBackground = styled.div`
  background-color: #f9f9f9;

  & button {
    outline: none;
  }
`;

const Wrapper = styled.div`
  max-width: 1150px;
  padding-bottom: 24px;
  margin: 0 auto 0;
`;

const TableWrapper = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const TableHeadItem = styled.div`
  align-self: center;
  padding-left: 16px;
  font-weight: bold;
  line-height: 1.2;
  color: #393636;
`;

const TableHead = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: ${lineTemplate};
  grid-template-rows: 56px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;

  & ${TableHeadItem}:first-child {
    justify-self: start;
    padding-left: 16px;
  }
`;

const LoaderBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
`;

export default class WitnessesTop extends PureComponent {
  static propTypes = {
    isWitness: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
    stopLeader: PropTypes.func.isRequired,
    openBecomeLeaderDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  static async getInitialProps({ store }) {
    await store.dispatch(fetchLeaders());
  }

  onNeedLoadMore = async () => {
    const { sequenceKey, fetchLeaders } = this.props;

    try {
      await fetchLeaders({ sequenceKey });
    } catch (err) {
      displayError(tt('g.error'), err);
    }
  };

  onBecomeLeaderClick = () => {
    const { openBecomeLeaderDialog } = this.props;
    openBecomeLeaderDialog();
  };

  onStopLeaderClick = async () => {
    const { stopLeader } = this.props;

    if (await DialogManager.dangerConfirm()) {
      try {
        await stopLeader();
      } catch (err) {
        displayError(err);
      }
    }
  };

  render() {
    const { isWitness, items, isEnd, isLoading, isError } = this.props;

    return (
      <WrapperForBackground>
        <Wrapper>
          <WitnessHeader
            title={tt('witnesses_jsx.top_witnesses')}
            subTitle={tt('witnesses_jsx.you_can_vote_for_maximum_of_witnesses')}
            actions={() =>
              isWitness ? (
                <Button light onClick={this.onStopLeaderClick}>
                  {tt('witnesses_jsx.stop')}
                </Button>
              ) : (
                <Button onClick={this.onBecomeLeaderClick}>{tt('witnesses_jsx.become')}</Button>
              )
            }
          />
          <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
            <TableWrapper>
              <TableHead>
                <TableHeadItem>{tt('witnesses_jsx.witness')}</TableHeadItem>
                <TableHeadItem />
                {/*<PercentHeadItem>%</PercentHeadItem>*/}
                <TableHeadItem>{tt('witnesses_jsx.information')}</TableHeadItem>
                <TableHeadItem>{tt('witnesses_jsx.rating')}</TableHeadItem>
                {/*<MissedBlocksHeadItem>*/}
                {/*  <div>{tt('witnesses_jsx.missed_1')}</div>*/}
                {/*  <div>{tt('witnesses_jsx.missed_2')}</div>*/}
                {/*</MissedBlocksHeadItem>*/}
                {/*<LastBlockHeadItem>*/}
                {/*  <div>{tt('witnesses_jsx.last_block1')}</div>*/}
                {/*  <div>{tt('witnesses_jsx.last_block2')}</div>*/}
                {/*</LastBlockHeadItem>*/}
                {/*<PriceFeedHeadItem>{tt('witnesses_jsx.price_feed')}</PriceFeedHeadItem>*/}
                {/*<VotesHeadItem>{tt('witnesses_jsx.version')}</VotesHeadItem>*/}
                <TableHeadItem />
              </TableHead>
              {items.map((item, i) => (
                <WitnessesLine key={item.userId} index={i + 1} item={item} />
              ))}
              {isEnd || isError ? null : (
                <LoaderBlock>
                  <LoadingIndicator type="circle" size={40} />
                </LoaderBlock>
              )}
            </TableWrapper>
            {/*<VoteForAnyWitness*/}
            {/*  witnessVotes={witnessVotes}*/}
            {/*  accountWitnessVote={this.accountWitnessVote}*/}
            {/*/>*/}
          </InfinityScrollHelper>
        </Wrapper>
      </WrapperForBackground>
    );
  }
}
