import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

import BlockUserButton from 'components/common/BlockUserButton';

const fromUp = keyframes`
    from {
        bottom: calc(100% + 15px);
        opacity: 0;
    }
    to {
        bottom: calc(100% + 5px);
        opacity: 1;
    }
`;

const Wrapper = styled.div`
  position: absolute;
  right: 50%;
  z-index: 1000;
  transform: translateX(50%);
  padding: 5px 0;
  margin-bottom: 5px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  animation: ${fromUp} 0.2s linear forwards;
`;

const Pointer = styled.div`
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translate(50%, -50%) rotate(45deg);
  width: 14px;
  height: 14px;
  background-color: #fff;
  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  background-color: #fff;

  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: normal;
  color: #333;
`;

const BlockUser = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  cursor: pointer;
  white-space: nowrap;
  text-transform: capitalize;
  outline: none;

  &:hover {
    background-color: #f5f5f5;
  }

  & ${Icon} {
    flex-shrink: 0;
    margin-right: 5px;
  }
`;

export default class DotsMenu extends PureComponent {
  static propTypes = {
    authUser: PropTypes.string,
    accountUsername: PropTypes.string.isRequired,
  };

  wrapperRef = createRef();

  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('click', this.onAwayClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onAwayClick);
  }

  onAwayClick = e => {
    const { closeMenu } = this.props;
    if (!this.wrapperRef.current.contains(e.target)) {
      closeMenu();
    }
  };

  buttonClicked = () => {
    const { closeMenu } = this.props;
    closeMenu();
  };

  render() {
    const { accountUsername } = this.props;

    return (
      <Wrapper ref={this.wrapperRef}>
        <Pointer />
        <Content>
          <BlockUserButton
            BlockComp={
              <BlockUser>
                <Icon name="mute" size="18" />
                {tt('g.mute')}
              </BlockUser>
            }
            UnblockComp={
              <BlockUser>
                <Icon name="unmute" size="18" />
                {tt('g.unmute')}
              </BlockUser>
            }
            blockingUser={accountUsername}
            buttonClicked={this.buttonClicked}
          />
        </Content>
      </Wrapper>
    );
  }
}
