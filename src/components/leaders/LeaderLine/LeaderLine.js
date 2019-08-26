import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { Link } from 'shared/routes';
import Icon from 'components/golos-ui/Icon';
import { displayError, displaySuccess } from 'utils/toastMessages';
import links from 'utils/Links';
import CloseOpenButton from 'components/cards/CloseOpenButton';

export const lineTemplate = '170px 70px 300px 180px minmax(60px, auto)';

const ellipsisStyles = `
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const WitnessInfoCeil = styled.div`
  align-self: center;
  padding-left: 16px;
`;

const WitnessNumberAndName = styled(WitnessInfoCeil)`
  display: flex;

  & > * {
    font-weight: bold;
    color: #393636;
  }

  & > a {
    margin-left: 12px;
    ${ellipsisStyles};
  }

  & > a:hover {
    color: #2879ff;
  }
`;

const VoteButtonCeil = styled(WitnessInfoCeil)`
  justify-self: center;
  padding: 0;
`;

const PostLink = styled(({ to, href, children, ...props }) =>
  to ? (
    <Link to={to}>
      <a {...props}>{children}</a>
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  )
)`
  position: relative;
  text-transform: capitalize;
  color: #2879ff;

  &:focus {
    color: #2879ff;
  }
  &:hover {
    color: #2879ff;
    text-decoration: underline;
  }

  & ${Icon} {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 8px;
    color: #2879ff;
  }
`;

// const LittleM = styled.span`
//   font-size: 10px;
//   color: #959595;
// `;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: ${lineTemplate};
  grid-template-rows: 55px;
  background-color: #f6f6f6;
  border-bottom: 1px solid #e1e1e1;
  transition: 0.25s background-color ease;

  & ${WitnessInfoCeil}:last-child {
    justify-self: end;
    padding-right: 16px;
  }

  ${is('collapsed')`
    background-color: #fff;
  `};

  ${is('isDeactive')`
    opacity: 0.4;
  `};
`;

const VoteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 1px solid rgba(57, 54, 54, 0.3);
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    ${({ upvoted }) =>
      upvoted ? 'background-color: #0e69ff' : 'border: 1px solid rgba(57, 54, 54, 0.6)'};
  }

  ${is('upvoted')`
    background-color: #2879ff;
    border: 0;
  `};

  & svg {
    flex-shrink: 0;
    color: ${({ upvoted }) => (upvoted ? '#fff' : '#393636')};
  }
`;

// const PriceFeedQuote = styled.span`
//   font-weight: bold;
// `;
//
// const PriceFeedTokens = styled.div`
//   white-space: nowrap;
// `;

// const LastFeedTime = styled.div`
//   font-size: 12px;
//   color: #959595;
//   ${ellipsisStyles};
// `;

// const InfoString = styled.div`
//   display: flex;
//   align-items: center;
//   overflow: hidden;
//   white-space: nowrap;
//   font-size: 14px;
//   color: #393636;
//
//   & ${LastFeedTime} {
//     margin-top: 3px;
//   }
//   & ${LittleM} {
//     margin-top: 4px;
//   }
// `;

// const InfoStringSpan = styled.span`
//   font-weight: bold;
// `;

// const FullInfoDivider = styled.div`
//   position: absolute;
//   width: 1px;
//   height: calc(100% - 4px);
//   background-color: #e1e1e1;
// `;

// const FullInfoFirstDivider = styled(FullInfoDivider)`
//   left: 382px;
// `;
//
// const FullInfoSecondDivider = styled(FullInfoDivider)`
//   right: 382px;
// `;
//
// const FullInfo = styled.div`
//   position: relative;
//   display: grid;
//   grid-auto-flow: column;
//   grid-template-columns: 1fr 1fr 1fr;
//   grid-template-rows: repeat(11, 1fr);
//
//   height: 370px;
//   border-bottom: 1px solid #e1e1e1;
//   background-color: #f6f6f6;
//   overflow: hidden;
//   transition: 0.25s background-color ease;
//
//   & ${InfoString} {
//     margin: 0 16px;
//     align-self: center;
//   }
//
//   ${is('collapsed')`
//     height: 0 !important;
//     border-bottom: 0 !important;
//     background-color: #fff !important;
//   `};
// `;

export default class LeaderLine extends PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.shape({}).isRequired,
    voteWitness: PropTypes.func.isRequired,
    unvoteWitness: PropTypes.func.isRequired,
  };

  state = {
    isCollapsed: true,
  };

  onToggleClick = () => {
    const { isCollapsed } = this.state;

    this.setState({ isCollapsed: !isCollapsed });
  };

  onVoteClick = async () => {
    const { item, voteWitness, unvoteWitness } = this.props;

    try {
      if (item.hasVote) {
        await unvoteWitness(item.userId);
      } else {
        await voteWitness(item.userId);
      }

      item.hasVote = !item.hasVote;
      this.forceUpdate();
    } catch (err) {
      console.error(err);
      displayError(tt('g.error'), err);
      return;
    }

    displaySuccess(tt('g.success_operation'));
  };

  // renderFullInfo() {
  //   const { item } = this.props;
  //
  //   return (
  //     <FullInfo>
  //       <FullInfoFirstDivider />
  //       <FullInfoSecondDivider />
  //       <InfoString>
  //         <InfoStringSpan>{name}:&nbsp;</InfoStringSpan>
  //         {value}
  //       </InfoString>
  //       ...
  //     </FullInfo>
  //   );
  // }

  renderPostLink() {
    const { item } = this.props;

    if (!item.url) {
      return null;
    }

    if (links.local.test(item.url)) {
      return <PostLink to={item.url}>{tt('witnesses_jsx.witness_thread')}</PostLink>;
    }

    return (
      <PostLink href={item.url}>
        {tt('witnesses_jsx.witness_thread')}
        <Icon name="external-link" size="13" />
      </PostLink>
    );
  }

  render() {
    const { index, item } = this.props;
    const { isCollapsed } = this.state;

    let title = null;

    if (!item.active) {
      title = tt('witnesses_jsx.witness_deactive');
    }
    //title = tt('witnesses_jsx.no_price_feed');

    return (
      <>
        <Wrapper title={title} isDeactive={!item.active} collapsed={isCollapsed}>
          <WitnessNumberAndName>
            <div>{index}</div>
            <Link route="profile" params={{ userId: item.username || item.userId }}>
              <a>{item.username || item.userId || 'hello'}</a>
            </Link>
          </WitnessNumberAndName>
          <VoteButtonCeil>
            <VoteButton
              title={tt(item.hasVote ? 'witnesses_jsx.remove_vote' : 'witnesses_jsx.vote')}
              upvoted={item.hasVote ? 1 : 0}
              onClick={this.onVoteClick}
            >
              <Icon name="witness-logo" size="16" />
            </VoteButton>
          </VoteButtonCeil>
          <WitnessInfoCeil>{this.renderPostLink()}</WitnessInfoCeil>
          <WitnessInfoCeil>{item.rating}</WitnessInfoCeil>
          <WitnessInfoCeil>
            <CloseOpenButton collapsed={isCollapsed} onClick={this.onToggleClick} />
          </WitnessInfoCeil>
        </Wrapper>
        {/*{isCollapsed ? null : this.renderFullInfo()}*/}
      </>
    );
  }
}
