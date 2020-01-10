/* eslint-disable class-methods-use-this, import/no-named-as-default */
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';
import ToastsManager from 'toasts-manager';
import BigNum from 'bignumber.js';

import { displayError } from 'utils/toastMessages';
import Icon from 'components/golos-ui/Icon';
import Slider from 'components/golos-ui/Slider';
// import PostPayout from 'components/common/PostPayout';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import { confirmVote } from 'helpers/votes';
import Popover from '../Popover';
import PayoutInfo from '../PayoutInfo';

import {
  // USERS_NUMBER_IN_TOOLTIP,
  getSavedPercent,
  savePercent,
  // makeTooltip,
  // usersListForTooltip,
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

// const PostPayoutStyled = styled(PostPayout)`
//   white-space: nowrap;
//   user-select: none;
// `;

const Money = styled.div`
  position: relative;
`;

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
    // username: PropTypes.string,
    // vertical: PropTypes.bool,
    isRich: PropTypes.bool,
    settingsVotePower: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalSum: PropTypes.instanceOf(BigNum),
    currency: PropTypes.string.isRequired,
    payoutRounding: PropTypes.number,

    waitForTransaction: PropTypes.func.isRequired,
    vote: PropTypes.func.isRequired,
    getVoters: PropTypes.func.isRequired,
    openVotersDialog: PropTypes.func.isRequired,
    showPayoutDialog: PropTypes.func.isRequired,
    showDislikeAlert: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    fetchComment: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: null,
    // username: '',
    // vertical: false,
    isRich: false,
    settingsVotePower: 100,
    totalSum: new BigNum(0),
    payoutRounding: 3,
  };

  state = {
    isVoting: false,
    sliderAction: null,
    showSlider: false,
    votePercent: 0,
    isMobile: false,
  };

  rootRef = createRef();

  likeRef = createRef();

  dislikeRef = createRef();

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
    const { entity, getVoters, openVotersDialog } = this.props;

    if (entity?.type) {
      const data = {
        contentId: entity.contentId,
        type: 'like',
        entityType: entity.type,
      };

      try {
        await getVoters(data, null);
      } catch (err) {
        return displayError('Cannot load voters list', err);
      }

      openVotersDialog({ data, id: entity.id, isLikes: true });
      return;
    }

    return ToastsManager.err('Cannot load voters list');
  };

  onDislikesNumberClick = async () => {
    const { entity, getVoters, openVotersDialog } = this.props;

    if (entity?.type) {
      const data = {
        contentId: entity.contentId,
        type: 'dislike',
        entityType: entity.type,
      };

      try {
        await getVoters(data, null);
      } catch (err) {
        return displayError('Cannot load voters list', err);
      }

      openVotersDialog({ data, id: entity.id, isLikes: false });
      return;
    }
    return ToastsManager.err('Cannot load voters list');
  };

  getPayoutInfoComponent = () => {
    const { entity } = this.props;

    return <PayoutInfo entity={entity} />;
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

  onLikeClick = () => {
    const { entity, isRich, settingsVotePower } = this.props;
    const { showSlider } = this.state;

    if (showSlider) {
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
    const { entity, isRich, showDislikeAlert } = this.props;
    const { showSlider } = this.state;

    if (showSlider) {
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
    } else if (await showDislikeAlert()) {
      this.vote(-1);
    }
  };

  vote = async fraction => {
    const { entity, vote, waitForTransaction, fetchPost, fetchComment } = this.props;

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

        if (entity.type === 'post') {
          await fetchPost(contentId);
        } else {
          await fetchComment(contentId);
        }
      } catch (err) {
        displayError(tt('g.transaction_wait_failed'), err);
      }

      // Update data
    } catch (err) {
      displayError(err);
    }

    this.setState({
      isVoting: false,
    });
  };

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
    const { showDislikeAlert } = this.props;
    const { sliderAction, votePercent } = this.state;

    if (sliderAction === 'dislike') {
      if (!(await showDislikeAlert())) {
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
    const { showPayoutDialog, entity } = this.props;

    showPayoutDialog(entity);
  };

  onResize = () => {
    const isMobile = window.innerWidth < MOBILE_WIDTH;

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.isMobile !== isMobile) {
      this.setState({
        isMobile,
      });
    }
  };

  calcTipLeft() {
    return 0;
  }

  callVerticalOffset() {
    return 0;
  }

  hideSlider() {
    this.setState({
      showSlider: false,
      sliderAction: null,
    });

    window.removeEventListener('click', this.onAwayClick);
    window.removeEventListener('touchstart', this.onAwayClick);
  }

  renderSlider() {
    const { sliderAction, votePercent } = this.state;

    const tipLeft = this.calcTipLeft();
    const verticalOffset = this.callVerticalOffset();

    return (
      <SliderBlock style={{ top: verticalOffset }}>
        <SliderBlockTip left={`${tipLeft}px`} />
        <OkIcon
          role="button"
          name="check"
          red={sliderAction === 'dislike' ? 1 : 0}
          aria-label={tt('g.vote')}
          data-tooltip={tt('g.vote')}
          onClick={this.onOkVoteClick}
        />
        <SliderStyled
          role="button"
          value={votePercent}
          red={sliderAction === 'dislike'}
          onChange={this.onPercentChange}
        />
        <CancelIcon
          role="button"
          name="cross"
          data-tooltip={tt('g.cancel')}
          aria-label={tt('g.cancel')}
          onClick={this.onCancelVoteClick}
        />
      </SliderBlock>
    );
  }

  renderPayout(add) {
    const { totalSum, currency, payoutRounding } = this.props;
    const { isVoting, isMobile } = this.state;
    // const postLink = data.get('author') + '/' + data.get('permlink');

    // eslint-disable-next-line no-shadow
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
              {totalSum.toFixed(payoutRounding)} GOLOS{/*currency*/}
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
              {totalSum.toFixed(payoutRounding)} GOLOS{/*currency*/}
              {/* <PostPayoutStyled postLink={postLink} /> */}
              {add}
            </MoneyText>
          </Money>
        </MoneyWrapper>
      </Popover>
    );
  }

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

  renderInner() {
    throw new Error('Abstract method call');
  }

  render() {
    const { entity } = this.props;
    if (!entity) {
      return null;
    }

    return this.renderInner();
  }
}
