import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import sentry from 'shared/sentry';
import Button from 'components/golos-ui/Button';
import Icon from 'components/golos-ui/Icon';

const IconStyled = styled(Icon)`
  width: 14px;
  height: 14px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  padding: 20px;
  margin-top: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 500px) {
    padding: 10px;
  }
`;

const Title = styled.h2`
  font-size: 26px;
`;

const Text = styled.p`
  margin: 16px 0;
`;

const Description = styled.pre`
  margin: 16px 0;
  font-family: monospace;
  font-size: 14px;
  color: grey;
`;

const ToggleStack = styled.button.attrs({ type: 'button' })`
  text-transform: none;
  text-decoration: underline;
  font-size: 15px;
  cursor: pointer;
`;

const CallStack = styled.pre`
  max-height: 240px;
  padding: 10px 0;
  margin: 10px 0 16px;
  font-family: monospace;
  font-size: 12px;
  color: grey;
  background-color: #f5f5f5;
  overflow: auto;
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 16px;

  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

const { captureException } = sentry();

export default class Guard extends PureComponent {
  state = {
    isError: false,
    error: null,
    stack: null,
    isShowStack: false,
  };

  componentDidCatch(error, errorInfo) {
    captureException(error, { errorInfo });

    let stack = errorInfo ? errorInfo.componentStack : null;

    if (stack) {
      stack = stack.replace(/^\n/, '');
    }

    this.setState({
      isError: true,
      error: error,
      stack,
    });
  }

  onRetryClick = () => {
    this.setState({
      isError: false,
      error: null,
      stack: null,
    });
  };

  onRefreshClick = () => {
    window.location.reload();
  };

  onToggleStack = () => {
    const { isShowStack } = this.state;

    this.setState({
      isShowStack: !isShowStack,
    });
  };

  render() {
    const { translationKey, children } = this.props;
    const { isError, error, stack, isShowStack } = this.state;

    if (isError) {
      return (
        <Wrapper>
          <Title>{tt('guard.title')}</Title>
          {translationKey ? <Text>{tt(translationKey)}</Text> : null}
          <Description>{error.toString()}</Description>
          {stack ? (
            <>
              <ToggleStack onClick={this.onToggleStack}>
                {isShowStack ? tt('guard.hide_details') : tt('guard.show_details')}
              </ToggleStack>
              {isShowStack ? <CallStack>{stack}</CallStack> : null}
            </>
          ) : null}
          <Buttons>
            <Button onClick={this.onRetryClick}>{tt('guard.retry')}</Button>
            <Button onClick={this.onRefreshClick}>
              <IconStyled name="reload" /> {tt('guard.refresh')}
            </Button>
          </Buttons>
        </Wrapper>
      );
    }

    return children;
  }
}
