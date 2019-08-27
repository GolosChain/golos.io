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

export default class VoteWitnessButton extends Component {
  static propTypes = {
    isVoted: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    voteWitness: PropTypes.func.isRequired,
    unvoteWitness: PropTypes.func.isRequired,
    targetUserId: PropTypes.string.isRequired,
    buttonClicked: PropTypes.func,
    UnvoteComp: PropTypes.element,
    VoteComp: PropTypes.element,
  };

  static defaultProps = {
    buttonClicked: null,
  };

  toggleBlock = async () => {
    const {
      isVoted,
      targetUserId,
      voteWitness,
      unvoteWitness,
      currentUsername,
      buttonClicked,
    } = this.props;

    if (buttonClicked) {
      buttonClicked();
    }
    try {
      if (!currentUsername) {
        throw new Error('Unauthorized');
      }

      if (isVoted) {
        await unvoteWitness(targetUserId);
      } else {
        await voteWitness(targetUserId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { isLoading, UnvoteComp, VoteComp, isVoted, className } = this.props;

    const text = isVoted ? tt('witnesses_jsx.remove_vote') : tt('witnesses_jsx.vote');

    return (
      <Wrapper
        data-tooltip={text}
        aria-label={text}
        disable={isLoading}
        className={className}
        onClick={this.toggleBlock}
      >
        {isVoted ? UnvoteComp : VoteComp}
      </Wrapper>
    );
  }
}
