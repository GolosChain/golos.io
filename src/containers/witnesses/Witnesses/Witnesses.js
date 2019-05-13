import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import WitnessesLine, { lineTemplate } from '../WitnessesLine';
import { displayError } from 'utils/toastMessages';
import { getScrollElement } from 'helpers/window';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import VoteForAnyWitness from '../VoteForAnyWitness';

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

const Header = styled.div`
  padding-top: 30px;
`;

const HeaderTitle = styled.h2`
  margin-bottom: 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 34px;
  font-weight: bold;
  line-height: 1.21;
  letter-spacing: 0.4px;
  color: #333;
`;

const HeaderSubtitle = styled.p`
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  letter-spacing: 0.2px;
  color: #393636;
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

export default class Witnesses extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  componentDidMount() {
    const { items, isEnd } = this.props;

    window.addEventListener('scroll', this.onScroll);

    if (items.length === 0 && !isEnd) {
      this.loadMore();
    } else {
      this.onScroll();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const rest = document.body.clientHeight - getScrollElement().scrollTop;

    if (window.innerHeight * 1.4 > rest) {
      this.loadMore();
    }
  };

  loadMore = async () => {
    const { isLoading, isEnd, sequenceKey, fetchLeaders } = this.props;

    if (isLoading || isEnd) {
      return;
    }

    try {
      await fetchLeaders({ sequenceKey });
    } catch (err) {
      console.error(err);
      displayError(tt('g.error'), err);
    }
  };

  render() {
    const { items, isEnd, isError } = this.props;

    return (
      <WrapperForBackground>
        <Wrapper>
          <Header>
            <HeaderTitle>{tt('witnesses_jsx.top_witnesses')}</HeaderTitle>
            <HeaderSubtitle>
              {/*<strong>*/}
              {/*  {tt('witnesses_jsx.you_have_votes_remaining') +*/}
              {/*    tt('witnesses_jsx.you_have_votes_remaining_count', {*/}
              {/*      count: '???',*/}
              {/*    })}*/}
              {/*  .*/}
              {/*</strong>{' '}*/}
              {tt('witnesses_jsx.you_can_vote_for_maximum_of_witnesses')}.
            </HeaderSubtitle>
          </Header>
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
        </Wrapper>
      </WrapperForBackground>
    );
  }
}
