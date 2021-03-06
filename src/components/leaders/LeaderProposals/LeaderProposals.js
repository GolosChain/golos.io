import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { ToggleFeature } from '@flopflip/react-redux';

import { PROPOSALS_MANAGE_BUTTON, CUSTOM_PROPOSALS_BUTTON } from 'shared/feature-flags';
import { fetchProposals } from 'store/actions/gate';
import { displayError } from 'utils/toastMessages';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import Button from 'components/golos-ui/Button';
import PageHeader from 'components/common/PageHeader';
import ProposalCard from '../ProposalCard';

const PAGE_SIZE = 20;

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

const List = styled.ul`
  margin: 20px 0;
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
  margin-bottom: 30px;
  font-size: 18px;
  color: #8a8a8a;
`;

const LoaderBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
`;

export default class LeaderProposals extends PureComponent {
  static propTypes = {
    isWitness: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
    fetchProposals: PropTypes.func.isRequired,
    openManageCommunityDialog: PropTypes.func.isRequired,
    openCustomProposalDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
  };

  static async getInitialProps({ store }) {
    await store.dispatch(
      fetchProposals({
        offset: 0,
        limit: PAGE_SIZE,
      })
    );
  }

  onNeedLoadMore = async () => {
    const { items, fetchProposals } = this.props;

    try {
      await fetchProposals({ offset: items.length, limit: PAGE_SIZE });
    } catch (err) {
      displayError(tt('g.error'), err);
    }
  };

  onManageClick = () => {
    const { openManageCommunityDialog } = this.props;
    openManageCommunityDialog();
  };

  onCreateCustomProposalClick = () => {
    const { openCustomProposalDialog } = this.props;
    openCustomProposalDialog();
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

    return (
      <>
        <List>{items.map(this.renderItem)}</List>
        {isEnd ? null : (
          <LoaderBlock>
            <LoadingIndicator type="circle" size={40} />
          </LoaderBlock>
        )}
      </>
    );
  }

  renderItem = id => {
    return (
      <Item key={id}>
        <ProposalCard fullProposalId={id} />
      </Item>
    );
  };

  render() {
    const { isWitness, isEnd, isLoading } = this.props;

    return (
      <WrapperForBackground>
        <Wrapper>
          <PageHeader
            title={tt('witnesses_jsx.tabs.proposals')}
            actions={() =>
              isWitness ? (
                <>
                  <ToggleFeature flag={CUSTOM_PROPOSALS_BUTTON}>
                    <Button onClick={this.onCreateCustomProposalClick}>
                      {tt('witnesses_jsx.create_custom_proposal')}
                    </Button>
                  </ToggleFeature>
                  <ToggleFeature flag={PROPOSALS_MANAGE_BUTTON}>
                    <Button onClick={this.onManageClick}>{tt('witnesses_jsx.manage')}</Button>
                  </ToggleFeature>
                </>
              ) : null
            }
          />
          <InfinityScrollHelper disabled={isEnd || isLoading} onNeedLoadMore={this.onNeedLoadMore}>
            {this.renderContent()}
          </InfinityScrollHelper>
        </Wrapper>
      </WrapperForBackground>
    );
  }
}
