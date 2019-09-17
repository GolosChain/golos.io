import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';
import LoadingIndicator from 'components/elements/LoadingIndicator';

import { LoaderWrapper, EmptyBlock } from '../VestingsList/VestingsList';
import VestingDelegationsLine from '../VestingDelegationsLine';

const ErrorBlock = styled.div`
  padding: 28px 20px 30px;
`;

export default class VestingDelegations extends PureComponent {
  state = {
    isLoading: true,
    error: null,
    items: null,
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { userId, getDelegationState } = this.props;

    try {
      const items = await getDelegationState({
        userId,
      });

      this.setState({
        isLoading: false,
        error: null,
        items,
      });
    } catch (err) {
      console.error(err);

      this.setState({
        isLoading: false,
        error: err,
        items: null,
      });
    }
  }

  render() {
    const { error, isLoading, items } = this.state;

    if (isLoading) {
      return (
        <LoaderWrapper>
          <LoadingIndicator type="circle" size={40} />
        </LoaderWrapper>
      );
    }

    if (error) {
      return (
        <ErrorBlock>
          {tt('g.error')} {error.message}
        </ErrorBlock>
      );
    }

    if (isLoading) {
      return <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>;
    }

    return items.map(delegation => (
      <VestingDelegationsLine key={delegation.from} delegation={delegation} />
    ));
  }
}
