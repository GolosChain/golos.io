import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';
import ToastsManager from 'toasts-manager';

import { displayError } from 'utils/toastMessages';
import Icon from 'components/golos-ui/Icon';
import Slider from 'components/golos-ui/Slider';
import PostPayout from 'components/common/PostPayout';
import DislikeAlert from 'components/dialogs/DislikeAlert';
import DialogManager from 'components/elements/common/DialogManager';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import { confirmVote } from 'helpers/votes';
import Popover from '../Popover';
import PayoutInfo from '../PayoutInfo';
import PayoutInfoDialog from '../PayoutInfoDialog';

import {
  USERS_NUMBER_IN_TOOLTIP,
  getSavedPercent,
  savePercent,
  makeTooltip,
  usersListForTooltip,
} from './helpers';

const MOBILE_WIDTH = 890;

const LIKE_PERCENT_KEY = 'golos.like-percent';
const DISLIKE_PERCENT_KEY = 'golos.dislike-percent';

export const SLIDER_OFFSET = 8;

const OkIcon = styled(Icon)`
  width: 16px;
  margin-right: 13px;
  color: #a8a8a8;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #2879ff;
  }

  ${is('red')`
    &:hover {
      color: #ff4e00;
    }
  `};
`;

const CancelIcon = styled(Icon)`
  width: 12px;
  margin-left: 13px;
  color: #e1e1e1;
  transition: color 0.15s;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const SliderBlock = styled.div`
  position: absolute;
  display: flex;
  height: 40px;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 220px;
  padding: 0 14px;
  margin: 0 -${SLIDER_OFFSET}px;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  background: #fff;
  animation: from-down 0.2s;

  @media (max-width: 360px) {
    margin: 0;
    z-index: 10;
  }
`;

const SliderBlockTip = styled.div`
  position: absolute;
  bottom: 0;
  left: ${a => a.left || '50%'};
  margin-left: -5px;
  margin-bottom: -5px;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background: #fff;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.1);
`;

const SliderStyled = styled(Slider)`
  flex-grow: 1;
  flex-shrink: 1;
`;

const PostPayoutStyled = styled(PostPayout)`
  white-space: nowrap;
  user-select: none;
`;

const Money = styled.div``;

const MoneyWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 4px;
  cursor: pointer;

  @media (max-width: 500px) {
    height: 48px;
    padding: 0 8px;
  }
`;

const MoneyText = styled.div`
  ${is('isInvisible')`
    visibility: hidden;
  `};
`;

const LoaderWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default class VotePanelAbstract extends PureComponent {
  static propTypes = {
    entity: PropTypes.shape({}),
    username: PropTypes.string,
    vertical: PropTypes.bool,
    waitForTransaction: PropTypes.func.isRequired,
    vote: PropTypes.func.isRequired,
  };

  state = {
    isVoting: false,
    sliderAction: null,
    showSlider: false,
    votePercent: 0,
    isMobile: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('click', this.onAwayClick);
    window.removeEventListener('touchstart', this.onAwayClick);
  }

  getMoneyComponent() {
    return Money;
  }

  onLikesNumberClick = async () => {
    ToastsManager.warn('Просмотр списка проголосовавших временно не работает');
    return;

    // TODO: uncomment when fetchPostVotes and FetchCommentVotes will return real data

    // const { entity, fetchPostVotes, fetchCommentVotes } = this.props;

    // if (entity?.type) {
    //   switch (entity.type) {
    //     case 'post':
    //       await fetchPostVotes(entity.contentId);
    //       break;

    //     case 'comment':
    //       await fetchCommentVotes(entity.contentId);
    //       break;

    //     default:
    //       break;
    //   }
    // }

    // const { contentLink } = this.props;
    // this.props.openVotersDialog(contentLink, 'likes');
  };

  onDislikesNumberClick = () => {
    ToastsManager.warn('Просмотр списка проголосовавших временно не работает');
    return;

    const { contentLink } = this.props;

    this.props.openVotersDialog(contentLink, 'dislikes');
  };

  render() {
    if (!this.props.entity) {
      return null;
    }

    return this.renderInner();
  }

  renderInner() {
    throw new Error('Abstract method call');
  }

  calcTipLeft() {
    return 0;
  }

  callVerticalOffset() {
    return 0;
  }

  renderSlider() {
    const { sliderAction, votePercent } = this.state;

    const tipLeft = this.calcTipLeft();
    const verticalOffset = this.callVerticalOffset();

    return (
      <SliderBlock style={{ top: verticalOffset }}>
        <SliderBlockTip left={`${tipLeft}px`} />
        <OkIcon
          name="check"
          red={sliderAction === 'dislike' ? 1 : 0}
          data-tooltip={tt('g.vote')}
          onClick={this.onOkVoteClick}
        />
        <SliderStyled
          value={votePercent}
          red={sliderAction === 'dislike'}
          onChange={this.onPercentChange}
        />
        <CancelIcon name="cross" data-tooltip={tt('g.cancel')} onClick={this.onCancelVoteClick} />
      </SliderBlock>
    );
  }

  getPayoutInfoComponent = () => {
    const { entity } = this.props;

    return <PayoutInfo postLink={entity.id} />;
  };

  // getVotesTooltips() {
  //   const { votesSummary } = this.props;
  //   const { showSlider } = this.state;
  //
  //   if (showSlider) {
  //     return {};
  //   }
  //
  //   return {
  //     likeTooltip: makeTooltip(
  //       usersListForTooltip(votesSummary.firstLikes),
  //       votesSummary.likes > USERS_NUMBER_IN_TOOLTIP
  //     ),
  //     dislikeTooltip: makeTooltip(
  //       usersListForTooltip(votesSummary.firstDislikes),
  //       votesSummary.dislikes > USERS_NUMBER_IN_TOOLTIP
  //     ),
  //   };
  // }

  renderPayout(add) {
    const { totalSum } = this.props;
    const { isVoting, isMobile } = this.state;
    // const postLink = data.get('author') + '/' + data.get('permlink');

    const Money = this.getMoneyComponent();

    if (isMobile) {
      return (
        <MoneyWrapper aria-label={tt('aria_label.expected_payout')} onClick={this.onPayoutClick}>
          <Money isVoting={isVoting}>
            {isVoting ? (
              <LoaderWrapper>
                <LoadingIndicator type="circle" size={16} />
              </LoaderWrapper>
            ) : null}
            <MoneyText isInvisible={isVoting}>
              {totalSum} GOLOS
              {/* <PostPayoutStyled postLink={postLink} /> */}
              {add}
            </MoneyText>
          </Money>
        </MoneyWrapper>
      );
    }

    return (
      <Popover content={this.getPayoutInfoComponent}>
        <MoneyWrapper>
          <Money isVoting={isVoting}>
            {isVoting ? (
              <LoaderWrapper>
                <LoadingIndicator type="circle" size={16} />
              </LoaderWrapper>
            ) : null}
            <MoneyText isInvisible={isVoting}>
              {totalSum} GOLOS
              {/* <PostPayoutStyled postLink={postLink} /> */}
              {add}
            </MoneyText>
          </Money>
        </MoneyWrapper>
      </Popover>
    );

    // return (
    //   <MoneyWrapper>
    //     <Money isVoting={isVoting}>
    //       {isVoting ? (
    //         <LoaderWrapper>
    //           <LoadingIndicator type="circle" size={16} />
    //         </LoaderWrapper>
    //       ) : null}
    //       <MoneyText isInvisible={isVoting}>
    //         {entity.payout.rShares}
    //         {/* <PostPayoutStyled postLink={postLink} /> */}
    //         {add}
    //       </MoneyText>
    //     </Money>
    //   </MoneyWrapper>
    // );
  }

  hideSlider() {
    this.setState({
      showSlider: false,
      sliderAction: null,
    });

    window.removeEventListener('click', this.onAwayClick);
    window.removeEventListener('touchstart', this.onAwayClick);
  }

  rootRef = createRef();

  likeRef = createRef();

  dislikeRef = createRef();

  onLikeClick = () => {
    const { entity, isRich, settingsVotePower } = this.props;

    if (this.state.showSlider) {
      this.hideSlider();
      return;
    }

    if (entity.votes.hasUpVote) {
      this.vote(0);
      return;
    }

    if (isRich) {
      if (settingsVotePower) {
        const votePower = Number(settingsVotePower);

        if (votePower >= 1 && votePower <= 100) {
          this.vote(settingsVotePower / 100);
          return;
        }
      }

      this.setState({
        votePercent: getSavedPercent(LIKE_PERCENT_KEY),
        sliderAction: 'like',
        showSlider: true,
      });
      return;
    }

    this.vote(1);
  };

  onDislikeClick = async () => {
    const { entity, isRich } = this.props;

    if (this.state.showSlider) {
      this.hideSlider();
    } else if (entity.votes.hasDownVote) {
      this.vote(0);
    } else if (isRich) {
      this.setState({
        votePercent: getSavedPercent(DISLIKE_PERCENT_KEY),
        sliderAction: 'dislike',
        showSlider: true,
      });

      window.addEventListener('click', this.onAwayClick);
      window.addEventListener('touchstart', this.onAwayClick);
    } else if (await this.showDislikeAlert()) {
      this.vote(-1);
    }
  };

  vote = async fraction => {
    const { entity, vote, waitForTransaction } = this.props;

    const weight = Math.max(-10000, Math.min(10000, Math.round(fraction * 10000)));

    if (!(await confirmVote(vote.votes, fraction))) {
      return;
    }

    this.setState({
      isVoting: true,
    });

    const { contentId } = entity;

    try {
      const result = await vote({
        contentId,
        type: entity.type,
        weight,
      });

      try {
        await waitForTransaction(result.transaction_id);
      } catch (err) {
        displayError(tt('g.transaction_wait_failed'), err);
      }

      // Update data
    } catch (err) {
      displayError('Voting error', err);
    }

    this.setState({
      isVoting: false,
    });
  };

  showDislikeAlert() {
    return new Promise(resolve => {
      DialogManager.showDialog({
        component: DislikeAlert,
        onClose(yes) {
          resolve(yes);
        },
      });
    });
  }

  onAwayClick = e => {
    if (this.rootRef.current && !this.rootRef.current.contains(e.target)) {
      this.hideSlider();
    }
  };

  onPercentChange = percent => {
    if (percent !== 0) {
      this.setState({
        votePercent: percent,
      });
    }
  };

  onOkVoteClick = async () => {
    const { sliderAction, votePercent } = this.state;

    if (sliderAction === 'dislike') {
      if (!(await this.showDislikeAlert())) {
        return;
      }
    }

    const multiplier = sliderAction === 'like' ? 1 : -1;

    if (votePercent) {
      this.vote(multiplier * (votePercent / 100));
      savePercent(sliderAction === 'like' ? LIKE_PERCENT_KEY : DISLIKE_PERCENT_KEY, votePercent);
      this.hideSlider();
    }
  };

  onCancelVoteClick = () => {
    this.hideSlider();
  };

  onPayoutClick = () => {
    const { data } = this.props;

    DialogManager.showDialog({
      component: PayoutInfoDialog,
      props: {
        postLink: `${data.get('author')}/${data.get('permlink')}`,
      },
    });
  };

  onResize = () => {
    const isMobile = window.innerWidth < MOBILE_WIDTH;

    if (this.state.isMobile !== isMobile) {
      this.setState({
        isMobile,
      });
    }
  };
}
