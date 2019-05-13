import React from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';
import { ButtonBlock } from 'components/golos-ui/Button';

import FollowUserButton from 'components/common/FollowUserButton';
import VoteWitnessButton from 'components/common/VoteWitnessButton';

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;

  & button:first-child {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    margin: 16px 0 10px 0;
  }

  @media (max-width: 576px) {
    justify-content: center;
    margin: 0;
  }

  @media (max-width: 410px) {
    flex-direction: column;

    & button:first-child {
      margin: 0;
    }
    & button:last-child {
      margin-top: 10px;
    }
  }
`;

const ButtonStyled = styled(ButtonBlock)`
  @media (max-width: 890px) {
    height: 30px;
  }
`;

const IconStyled = styled(Icon)`
  flex-shrink: 0;
  margin-right: 10px;
`;

export default function FollowWitnessButtons({ targetUser, isWitness }) {
  return (
    <Buttons>
      {isWitness && (
        <VoteWitnessButton
          VoteComp={
            <ButtonStyled light>
              <IconStyled name="witness-logo" size="16" />
              {tt('witnesses_jsx.vote')}
            </ButtonStyled>
          }
          UnvoteComp={
            <ButtonStyled light>
              <IconStyled name="opposite-witness" size="16" />
              {tt('witnesses_jsx.remove_vote')}
            </ButtonStyled>
          }
          targetUser={targetUser}
        />
      )}
      <FollowUserButton
        FollowComp={
          <ButtonStyled>
            <IconStyled name="plus" size="14" />
            {tt('g.follow')}
          </ButtonStyled>
        }
        UnfollowComp={
          <ButtonStyled light>
            <IconStyled name="tick" height="10" width="14" />
            {tt('g.subscriptions')}
          </ButtonStyled>
        }
        targetUser={targetUser}
      />
    </Buttons>
  );
}

FollowWitnessButtons.propTypes = {
  targetUser: PropTypes.string,
  isWitness: PropTypes.bool,
  isVoted: PropTypes.bool,
  isFollow: PropTypes.bool,
};
