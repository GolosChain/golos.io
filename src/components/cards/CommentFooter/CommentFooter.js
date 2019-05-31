import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import { openTransferDialog } from 'components/userProfile/common/RightActions/showDialogs';

import VotePanel from 'components/common/VotePanel';
import ReplyBlock from 'components/common/ReplyBlock';
import LoadingIndicator from 'components/elements/LoadingIndicator';

const FORCE_ONE_COLUMN_WIDTH = 550;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  z-index: 1;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    flex-direction: column;
    justify-content: unset;
  }
`;

const CommentVotePanel = styled(VotePanel)`
  padding: 6px 18px 4px;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    width: 100%;
  }
`;

const CommentReplyBlock = styled(ReplyBlock)`
  margin: 0;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    justify-content: center;
  }
`;

const CommentRightButtons = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    width: 100%;
    justify-content: center;
    border-top: 1px solid #e9e9e9;
  }
`;

const Splitter = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 26px;
  margin: 0 6px;
  background: #e1e1e1;
`;

const DonateSplitter = styled(Splitter)`
  margin: 0;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    flex-grow: 1;
    width: unset;
    background: unset;
  }
`;

const FooterConfirm = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
`;

const ButtonConfirm = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: #b7b7ba;
  cursor: pointer;

  ${is('main')`
    color: #2879ff !important;
  `};

  &:hover {
    color: #393636;
  }

  &:last-child {
    padding-right: 18px;
  }
`;

const DonateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    margin-left: 5px;
  }
`;

const LoaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default class CommentFooter extends Component {
  static propTypes = {
    commentRef: PropTypes.shape({}),
    contentLink: PropTypes.string,
    count: PropTypes.number.isRequired,
    comment: PropTypes.shape({}).isRequired,
    edit: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    replyRef: PropTypes.shape({}).isRequired,
    showReply: PropTypes.bool.isRequired,
    currentUsername: PropTypes.string,
    onReplyClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    commentRef: {},
    contentLink: '',
    currentUsername: '',
  };

  state = {
    isPosting: false,
  };

  handlePosting = ({ isPosting }) => {
    this.setState({ isPosting });
  };

  onCancelReplyClick = () => {
    const { replyRef } = this.props;
    replyRef.current.cancel();
  };

  onPostReplyClick = () => {
    const { replyRef } = this.props;
    replyRef.current.post(this.handlePosting);
  };

  onCancelEditClick = () => {
    const { commentRef } = this.props;
    commentRef.current.cancel();
  };

  onSaveEditClick = () => {
    const { commentRef } = this.props;
    commentRef.current.post(this.handlePosting);
  };

  onDonateClick = async () => {
    const { comment, currentUsername } = this.props;
    await openTransferDialog(
      currentUsername,
      comment.author,
      'donate',
      `${window.location.origin}/${comment.id}`
    );
  };

  render() {
    const { comment, contentLink, isOwner, showReply, edit, onReplyClick, count } = this.props;
    const { isPosting } = this.state;

    if (showReply) {
      return (
        <FooterConfirm>
          {!isPosting ? (
            <>
              <ButtonConfirm onClick={this.onCancelReplyClick}>{tt('g.cancel')}</ButtonConfirm>
              <Splitter />
            </>
          ) : null}
          <ButtonConfirm disabled={isPosting} main onClick={this.onPostReplyClick}>
            {isPosting ? (
              <LoaderWrapper>
                <LoadingIndicator type="circle" size={16} />
              </LoaderWrapper>
            ) : (
              tt('g.publish')
            )}
          </ButtonConfirm>
        </FooterConfirm>
      );
    }

    if (edit) {
      return (
        <FooterConfirm>
          {!isPosting ? (
            <>
              <ButtonConfirm onClick={this.onCancelEditClick}>{tt('g.cancel')}</ButtonConfirm>
              <Splitter />
            </>
          ) : null}
          <ButtonConfirm main onClick={this.onSaveEditClick}>
            {isPosting ? (
              <LoaderWrapper>
                <LoadingIndicator type="circle" size={16} />
              </LoaderWrapper>
            ) : (
              tt('g.save')
            )}
          </ButtonConfirm>
        </FooterConfirm>
      );
    }

    return (
      <Wrapper>
        <CommentVotePanel entity={comment} />
        <CommentRightButtons>
          {!isOwner && (
            <>
              <DonateButton
                role="button"
                name="comment-actions__donate"
                data-tooltip={tt('g.donate')}
                aria-label={tt('g.donate')}
                onClick={this.onDonateClick}
              >
                <Icon size="20" name="coins_plus" />
              </DonateButton>
              <DonateSplitter />
            </>
          )}
          <CommentReplyBlock
            // TODO: Fix counter
            count={count}
            link={contentLink}
            text={tt('g.reply')}
            onReplyClick={onReplyClick}
          />
        </CommentRightButtons>
      </Wrapper>
    );
  }
}
