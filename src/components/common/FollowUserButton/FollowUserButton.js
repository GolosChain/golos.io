/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import { displayError } from 'utils/toastMessages';
import { showLoginModal } from 'store/actions/modals';
import DialogManager from 'components/elements/common/DialogManager';
import UnfollowDialog from 'components/dialogs/UnfollowDialog';

const Wrapper = styled.button`
  ${is('disable')`
    pointer-events: none;
    opacity: 0.6;
    cursor: auto;
  `};
`;

export default class FollowUserButton extends Component {
  static propTypes = {
    isFollowed: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    targetUserId: PropTypes.string.isRequired,
    buttonClicked: PropTypes.func,
    currentUserId: PropTypes.string,
    UnfollowComp: PropTypes.element.isRequired,
    FollowComp: PropTypes.element.isRequired,
  };

  static defaultProps = {
    buttonClicked: null,
    currentUserId: null,
  };

  toggleBlock = async () => {
    const {
      isFollowed,
      targetUserId,
      followUser,
      unfollowUser,
      waitForTransaction,
      fetchProfile,
      currentUserId,
      buttonClicked,
    } = this.props;

    if (buttonClicked) {
      buttonClicked();
    }
    try {
      if (!currentUserId) {
        if (!(await showLoginModal())) {
          return;
        }
      }

      let result;
      if (isFollowed) {
        if (await this.showUnfollowAlert()) {
          result = await unfollowUser(targetUserId);
        }
      } else {
        result = await followUser(targetUserId);
      }

      await waitForTransaction(result.transaction_id);

      await fetchProfile({ userId: targetUserId });
    } catch (err) {
      displayError(tt('g.error'), err);
    }
  };

  showUnfollowAlert() {
    const { targetUserId } = this.props;

    return new Promise(resolve => {
      DialogManager.showDialog({
        component: UnfollowDialog,
        props: {
          targetUserId,
        },
        onClose: resolve,
      });
    });
  }

  render() {
    const { isFollowed, UnfollowComp, FollowComp, isLoading, className } = this.props;

    const text = isFollowed ? 'g.unfollow' : 'g.follow';
    return (
      <Wrapper
        data-tooltip={tt(text)}
        aria-label={tt(text)}
        disable={isLoading}
        className={className}
        onClick={this.toggleBlock}
      >
        {isFollowed ? UnfollowComp : FollowComp}
      </Wrapper>
    );
  }
}
