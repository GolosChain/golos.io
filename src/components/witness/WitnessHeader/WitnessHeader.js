import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import ToastsManager from 'toasts-manager';

import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const TextBlock = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
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

const HeaderButtons = styled.div`
  flex-shrink: 0;
`;

const LoaderWrapper = styled.div`
  margin-right: 10px;
  overflow: hidden;
  pointer-events: none;
`;

const Loader = styled(Icon).attrs({ name: 'refresh2' })`
  width: 26px;
  height: 26px;
  color: #707070;
  animation: rotate 1s linear infinite;
`;

export default class WitnessHeader extends PureComponent {
  static propTypes = {
    isWitness: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    openBecomeLeaderDialog: PropTypes.func.isRequired,
  };

  onBecomeLeaderClick = () => {
    const { openBecomeLeaderDialog } = this.props;
    openBecomeLeaderDialog();
  };

  onManageClick = () => {
    ToastsManager.error('No ready yet');
  };

  renderButtons() {
    const { isLoading, isWitness } = this.props;

    if (isLoading) {
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );
    }

    if (isWitness) {
      return <Button onClick={this.onManageClick}>{tt('witnesses_jsx.manage')}</Button>;
    }

    return <Button onClick={this.onBecomeLeaderClick}>{tt('witnesses_jsx.become')}</Button>;
  }

  render() {
    return (
      <Wrapper>
        <TextBlock>
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
        </TextBlock>
        <HeaderButtons>{this.renderButtons()}</HeaderButtons>
      </Wrapper>
    );
  }
}
