import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import Button from 'components/golos-ui/Button';
import { fetchProposals } from 'store/actions/gate';
import { displayError } from 'utils/toastMessages';
import { HeaderTitle } from '../common';
import ProposalCard from './ProposalCard';

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

const List = styled.ul`
  margin-top: 20px;
`;

const Item = styled.li`
  list-style: none;

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const ErrorBlock = styled.div`
  font-size: 18px;
  color: #f00;
`;

const EmptyBlock = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  color: #8a8a8a;
`;

const LoaderBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
`;

export default class WitnessProposals extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
    fetchProposals: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  static async getInitialProps({ store }) {
    await store.dispatch(fetchProposals());
  }

  onNeedLoadMore = async () => {
    const { sequenceKey, fetchProposals } = this.props;

    try {
      await fetchProposals({ sequenceKey });
    } catch (err) {
      displayError(tt('g.error'), err);
    }
  };

  renderContent() {
    const { items, isEnd, isLoading, isError } = this.props;

    if (isError) {
      return (
        <ErrorBlock>
          {tt('g.error')} <Button onClick={this.onNeedLoadMore}>{tt('g.retry')}</Button>
        </ErrorBlock>
      );
    }

    if (!items.length && !isLoading) {
      return <EmptyBlock>{tt('g.empty_list')}</EmptyBlock>;
    }

    const lines = items.map(item => this.renderItem(item));

    return (
      <>
        <List>{lines}</List>
        {isEnd ? null : (
          <LoaderBlock>
            <LoadingIndicator type="circle" size={40} />
          </LoaderBlock>
        )}
      </>
    );
  }

  renderItem(item) {
    return (
      <Item key={item.proposalId}>
        <ProposalCard data={item} />
      </Item>
    );
  }

  render() {
    const { isEnd, isLoading } = this.props;

    return (
      <WrapperForBackground>
        <Wrapper>
          <Header>
            <HeaderTitle>{tt('witnesses_jsx.tabs.proposals')}</HeaderTitle>
          </Header>
          <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
            {this.renderContent()}
          </InfinityScrollHelper>
        </Wrapper>
      </WrapperForBackground>
    );
  }
}
