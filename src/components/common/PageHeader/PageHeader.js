import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 30px;
  margin-bottom: 20px;

  @media (max-width: 1190px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 0;
`;

const HeaderTitle = styled.h2`
  line-height: 1.15;
  font-size: 34px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #333;
`;

const HeaderSubtitle = styled.div`
  margin-top: 4px;
  font-size: 16px;
  letter-spacing: 0.2px;
  color: #393636;
`;

const HeaderButtons = styled.div`
  flex-shrink: 0;
  margin: 10px -4px;

  & > * {
    margin: 0 5px !important;
  }
`;

const LoaderWrapper = styled.div`
  height: 34px;
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

export default class PageHeader extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    hideActions: PropTypes.bool.isRequired,
    actions: PropTypes.func,
  };

  static defaultProps = {
    actions: null,
  };

  renderButtons() {
    const { hideActions, isLoading, actions } = this.props;

    if (hideActions || !actions) {
      return null;
    }

    if (isLoading) {
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );
    }

    return actions();
  }

  render() {
    const { title, subTitle } = this.props;

    return (
      <Wrapper>
        <TextBlock>
          <HeaderTitle>{title}</HeaderTitle>
          <HeaderSubtitle>{subTitle}</HeaderSubtitle>
        </TextBlock>
        <HeaderButtons>{this.renderButtons()}</HeaderButtons>
      </Wrapper>
    );
  }
}
