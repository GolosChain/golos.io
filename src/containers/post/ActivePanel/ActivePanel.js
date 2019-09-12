import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

import VotePanel from 'components/common/VotePanel';
import ReplyBlock from 'components/common/ReplyBlock';
import ShareList from 'components/post/ShareList';
import { PopoverBackgroundShade, PopoverStyled } from 'components/post/PopoverAdditionalStyles';
import PostActions from 'components/post/PostActions';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 34px 0 30px 0;

  @media (max-width: 768px) {
    display: grid;
    padding: 2px 0 0;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1px 1fr;
    grid-template-areas:
      'vpw vpw vpw vpw vpw dm'
      'spl spl spl spl spl spl'
      'rsw rsw . . rbs rbs';

    &::after {
      content: '';
      display: block;
      grid-area: spl;
      width: 100%;
      margin-top: 2px;
      border-top: 1px solid #e1e1e1;
    }
  }

  @media (max-width: 360px) {
    max-width: 100%;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 26px;
  background: #e1e1e1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const VotePanelWrapper = styled(VotePanel)`
  padding: 0 13px 0 9px;

  @media (max-width: 768px) {
    display: flex;
    grid-area: vpw;
  }

  @media (max-width: 360px) {
    padding: 12px 7px;
  }
`;

const Repost = styled.div`
  padding: 0 18px;
  display: flex;
  align-items: center;

  & > svg {
    cursor: pointer;
    padding: 4px;
  }

  @media (max-width: 360px) {
    padding-left: 10px;
  }
`;

const SharingTriangle = styled(Repost)`
  position: relative;
  padding: 0 12px;

  ${is('isOpen')`
    & > svg {
      transition: color 0s;
      color: #2879ff;
    }
  `};
`;

const DotsMoreWrapper = styled.div`
  position: relative;
`;

const DotsMore = styled(Repost)`
  padding: 0 18px;

  & > ${Icon} {
    padding: 12px 4px;
  }

  ${is('isOpen')`
    & > ${Icon} {
      transition: color 0s;
      color: #2879ff;
    }
  `};

  @media (max-width: 768px) {
    grid-area: dm;
    justify-self: end;
  }

  @media (max-width: 360px) {
    padding: 0 5px;
  }
`;

// const Action = styled.div`
//   display: flex;
//   align-items: center;
//   cursor: pointer;

//   &:hover {
//     color: #2879ff;
//   }

//   svg {
//     min-width: 20px;
//     min-height: 20px;
//     padding: 0;
//   }
// `;

// const ActionText = styled.div`
//   margin-left: 25px;
//   font-family: Roboto, sans-serif;
//   font-size: 14px;
//   line-height: 44px;
//   white-space: nowrap;
//   cursor: pointer;
// `;

const ActionIcon = styled(Icon)``;

const ReplyBlockStyled = styled(ReplyBlock)`
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    justify-self: end;
    grid-area: rbs;
  }
`;

const RepostSharingWrapper = styled.div`
  display: flex;

  @media (max-width: 768px) {
    margin-left: -2px;
    grid-area: rsw;
  }
`;

const Actions = styled.div`
  padding: 20px 30px;

  @media (max-width: 768px) {
    position: relative;
    max-width: calc(100vw - 60px);
    min-width: 295px;
    background: #fff;
    border-radius: 7px;
  }
`;

ActionIcon.defaultProps = {
  width: 20,
  height: 20,
};

export default class ActivePanel extends Component {
  // static propTypes = {
  //   togglePin: PropTypes.func.isRequired,
  // };

  state = {
    showDotsPopover: false,
    showSharePopover: false,
  };

  promotePost = () => {
    const { account, permLink, openPromoteDialog } = this.props;
    openPromoteDialog(`${account}/${permLink}`);
  };

  openSharePopover = () => {
    this.setState({
      showSharePopover: true,
    });
  };

  closeSharePopover = () => {
    this.setState({
      showSharePopover: false,
    });
  };

  openDotsPopover = () => {
    this.setState({
      showDotsPopover: true,
    });
  };

  closeDotsPopover = () => {
    this.setState({
      showDotsPopover: false,
    });
  };

  repost = () => {
    const { post, openRepostDialog } = this.props;
    openRepostDialog({
      contentId: post.contentId,
    });
  };

  render() {
    const { post, username, isPinned, /* togglePin, */ isOwner, isFavorite } = this.props;
    const { showDotsPopover, showSharePopover } = this.state;

    const shareTooltip = showSharePopover ? undefined : tt('postfull_jsx.share_in_social_networks');
    const dotsTooltip = showDotsPopover ? undefined : tt('g.show_more_2');

    return (
      <Wrapper>
        <VotePanelWrapper entity={post} />
        <Divider />
        <RepostSharingWrapper>
          {isOwner ? null : (
            <>
              <Repost role="button" data-tooltip={tt('g.repost')} aria-label={tt('g.repost')}>
                <Icon width="30" height="27" name="repost" onClick={this.repost} />
              </Repost>
              <Divider />
            </>
          )}
          <SharingTriangle
            as="button"
            type="button"
            name="actions-panel__share"
            isOpen={showSharePopover}
            role="button"
            data-tooltip={shareTooltip}
            aria-label={shareTooltip}
          >
            <PopoverBackgroundShade show={showSharePopover} onClick={this.closeSharePopover} />
            <Icon width="26" height="26" name="sharing_triangle" onClick={this.openSharePopover} />
            <PopoverStyled
              position="top"
              closePopover={this.closeSharePopover}
              show={showSharePopover}
            >
              <ShareList horizontal post={post} />
            </PopoverStyled>
          </SharingTriangle>
        </RepostSharingWrapper>
        {username ? (
          <>
            <Divider />
            <DotsMoreWrapper>
              <DotsMore
                isOpen={showDotsPopover}
                as="button"
                type="button"
                name="actions-panel__more-actions"
                data-tooltip={dotsTooltip}
                aria-label={dotsTooltip}
              >
                <Icon
                  width="32"
                  height="32"
                  name="dots-more_normal"
                  onClick={this.openDotsPopover}
                />
              </DotsMore>
              <PopoverBackgroundShade show={showDotsPopover} onClick={this.closeDotsPopover} />
              <PopoverStyled
                position="top"
                closePopover={this.closeDotsPopover}
                show={showDotsPopover}
              >
                <Actions>
                  <PostActions
                    fullUrl={post.id}
                    isFavorite={isFavorite}
                    isPinned={isPinned}
                    isOwner={isOwner}
                    // togglePin={togglePin}
                    coloredOnHover
                    showText
                  />
                  {/* TODO: Temp disabled
                  {username ? (
                    <Action
                      onClick={this.promotePost}
                      role="button"
                      aria-label={tt('active_panel_tooltip.promote_post')}
                    >
                      <ActionIcon name="brilliant" />
                      <ActionText>{tt('active_panel_tooltip.promote_post')}</ActionText>
                    </Action>
                  ) : null}
                  */}
                </Actions>
              </PopoverStyled>
            </DotsMoreWrapper>
          </>
        ) : null}
        <ReplyBlockStyled count={post.children} post={post} text={tt('g.reply')} />
      </Wrapper>
    );
  }
}
