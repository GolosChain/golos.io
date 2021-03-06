import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

const Wrapper = styled.button`
  ${is('disable')`
    pointer-events: none;
    opacity: 0.6;
    cursor: auto;
  `};
`;

export default class BlockUserButton extends Component {
  static propTypes = {
    isBlocked: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    blockingUser: PropTypes.string.isRequired,
    showLoginOldDialog: PropTypes.string.isRequired,
    buttonClicked: PropTypes.func,
    UnblockComp: PropTypes.element,
    BlockComp: PropTypes.element,
  };

  static defaultProps = {
    buttonClicked: null,
  };

  toggleBlock = async () => {
    const {
      isBlocked,
      blockingUser,
      blockUser,
      unblockUser,
      currentUsername,
      buttonClicked,
      showLoginOldDialog,
    } = this.props;

    if (buttonClicked) {
      buttonClicked();
    }
    try {
      if (!currentUsername) {
        if (!(await showLoginOldDialog())) {
          return;
        }
      }

      if (isBlocked) {
        await unblockUser(blockingUser);
      } else {
        await blockUser(blockingUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { isLoading, UnblockComp, BlockComp, isBlocked, className } = this.props;

    let text = isBlocked ? 'g.unmute' : 'g.mute';
    return (
      <Wrapper
        data-tooltip={tt(text)}
        aria-label={tt(text)}
        disable={isLoading}
        className={className}
        onClick={this.toggleBlock}
      >
        {isBlocked ? UnblockComp : BlockComp}
      </Wrapper>
    );
  }
}
