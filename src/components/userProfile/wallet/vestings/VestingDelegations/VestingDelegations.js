import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import { DelegationType } from 'components/dialogs/DelegateDialog/types';

import { LoaderWrapper, EmptyBlock } from '../VestingsList/VestingsList';
import VestingDelegationsLine from '../VestingDelegationsLine';

const ErrorBlock = styled.div`
  padding: 28px 20px 30px;
`;

export default class VestingDelegations extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.shape({}),
    items: PropTypes.arrayOf(PropTypes.shape(DelegationType)),
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { userId, getDelegationState } = this.props;

    try {
      await getDelegationState({ userId });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { error, isLoading, items } = this.props;

    if (isLoading || !items) {
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
