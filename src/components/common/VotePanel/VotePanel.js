import React from 'react';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

import VotePanelAbstract, { SLIDER_OFFSET } from './VotePanelAbstract';

const OFFSET = -36;
const VERT_OFFSET_UP = -44;
const VERT_OFFSET_DOWN = 26;

const Root = styled.div``;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${is('vertical')`
    flex-direction: column;
    margin-top: -4px;
    margin-bottom: -4px;
  `};
`;

const LikeWrapper = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  cursor: pointer;

  @media (max-width: 500px) {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 410px) {
    width: 30px;
  }
`;

const LikeCount = styled.button`
  padding: ${({ vertical }) => (vertical ? '0 8px 2px' : '8px 8px 8px 3px')};
  color: #959595;
  cursor: pointer;
  transition: color 0.15s;

  @media (max-width: 500px) {
    padding: ${({ vertical }) => (vertical ? '0 8px 2px' : '8px 10px 8px 5px')};
    font-size: 16px;
  }

  &:hover {
    color: #000;
  }
`;

const LikeIcon = styled(Icon)`
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin-top: -5px;
  color: #393636;
  transition: color 0.2s;
`;

const LikeIconNeg = styled(LikeIcon)`
  margin-top: 0;
  margin-bottom: -5px;
  transform: scale(1, -1);
`;

const LikeBlock = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;

  ${is('vertical')`
    flex-direction: column;
    margin: 0 !important;
    padding: 0 0 10px;
  `};

  ${isNot('vertical')`
    &:hover,
    &:hover ${LikeIcon}, &:hover ${LikeIconNeg} {
      color: #000;
    }
  `};

  ${is('active')`
    ${LikeIcon}, ${LikeCount} {
      color: #2879ff !important;
    }
  `};

  ${is('activeNeg')`
    ${LikeIconNeg}, ${LikeCount} {
      color: #ff4e00 !important;
    }
  `};
`;

const IconTriangle = styled(Icon).attrs({
  name: 'triangle',
})`
  width: 5px;
  margin-left: 3px;
  vertical-align: middle;
  color: #393636;
  user-select: none;
`;

const Money = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 48px;
  height: 26px;
  padding: 0 9px;

  border: 1px solid #959595;
  border-radius: 100px;
  white-space: nowrap;
  color: #959595;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #393636;
    color: #393636;
  }

  @media (max-width: 500px) {
    height: 30px;
    font-size: 16px;
  }
`;

export default class VotePanel extends VotePanelAbstract {
  getMoneyComponent() {
    return Money;
  }

  calcTipLeft() {
    const { sliderAction } = this.state;

    const like = sliderAction === 'like' ? this.likeRef.current : this.dislikeRef.current;

    const box = this.rootRef.current.getBoundingClientRect();
    const likeBox = like.getBoundingClientRect();

    return SLIDER_OFFSET + (likeBox.left - box.left + likeBox.width / 2);
  }

  callVerticalOffset() {
    const { vertical } = this.props;
    const { sliderAction } = this.state;

    if (vertical) {
      if (sliderAction === 'like') {
        return VERT_OFFSET_UP;
      }
      return VERT_OFFSET_DOWN;
    }

    return OFFSET;
  }

  renderInner() {
    const { entity, className, vertical } = this.props;
    const { showSlider, sliderAction } = this.state;

    if (!entity) {
      return null;
    }

    // const { likeTooltip, dislikeTooltip } = this.getVotesTooltips();
    const likeTooltip = null;
    const dislikeTooltip = null;

    const { upCount: likesCount, downCount: dislikesCount } = entity.votes;

    return (
      <Root className={className} ref={this.rootRef}>
        <Wrapper vertical={vertical}>
          <LikeBlock active={entity.votes.hasUpVote || sliderAction === 'like'} vertical={vertical}>
            <LikeWrapper
              name="vote-panel__upvote"
              data-tooltip={tt('g.like')}
              aria-label={tt('g.like')}
              ref={this.likeRef}
              vertical={vertical}
              onClick={this.onLikeClick}
            >
              <LikeIcon name="like" />
            </LikeWrapper>
            <LikeCount
              data-tooltip={likeTooltip}
              data-tooltip-down
              data-tooltip-html
              name="vote-panel__upvotes-quantity"
              aria-label={tt('aria_label.likers_list', { count: likesCount })}
              vertical={vertical}
              onClick={likesCount === 0 ? null : this.onLikesNumberClick}
            >
              {likesCount}
              {vertical ? null : <IconTriangle />}
            </LikeCount>
          </LikeBlock>
          {vertical ? null : this.renderPayout()}
          <LikeBlock
            activeNeg={entity.votes.hasDownVote || sliderAction === 'dislike'}
            vertical={vertical}
          >
            <LikeWrapper
              name="vote-panel__downvote"
              data-tooltip={tt('g.dislike')}
              aria-label={tt('g.dislike')}
              ref={this.dislikeRef}
              vertical={vertical}
              negative
              onClick={this.onDislikeClick}
            >
              <LikeIconNeg name="like" />
            </LikeWrapper>
            <LikeCount
              data-tooltip={dislikeTooltip}
              data-tooltip-down
              data-tooltip-html
              name="vote-panel__downvotes-quantity"
              aria-label={tt('aria_label.dislikers_list', {
                count: dislikesCount,
              })}
              vertical={vertical}
              onClick={dislikesCount === 0 ? null : this.onDislikesNumberClick}
            >
              {dislikesCount}
              {vertical ? null : <IconTriangle />}
            </LikeCount>
          </LikeBlock>
          {showSlider ? this.renderSlider() : null}
        </Wrapper>
      </Root>
    );
  }
}
