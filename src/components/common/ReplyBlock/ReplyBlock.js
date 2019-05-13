/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'shared/routes';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import Icon from 'components/golos-ui/Icon';

const RepliesQuantity = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #959595;
  user-select: none;
`;

const ReplyIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  margin-right: 7px;
  margin-bottom: -2px;
  color: #393636;
`;

const Replies = styled(({ isLink, ...otherProps }) =>
  // eslint-disable-next-line
  isLink ? <a {...otherProps} /> : <div {...otherProps} />
)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
  height: 100%;
  min-height: 50px;
  padding: 0 10px;
  user-select: none;
  cursor: pointer;

  @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
    justify-content: center;
  }

  ${is('isLink')`
    cursor: pointer;
  `};

  ${is('compact')`
    flex-grow: 0;
    padding: 0 10px;
  `};

  ${is('mini')`
    height: unset;
    min-height: unset;
    padding: 0 10px;

    &:hover {
      &, ${RepliesQuantity}, ${ReplyIcon} {
        color: #333;
      }
    }

    ${RepliesQuantity} {
      font-size: 14px;
      color: #959595;

      @media (max-width: 500px) {
        font-size: 12px;
      }
    }

    ${ReplyIcon} {
      width: 17px;
      color: #959595;

      @media (max-width: 500px) {
        width: 15px;
      }
    }
  `};
`;

const Splitter = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 26px;
  background: #e1e1e1;
`;

const ReplyButton = styled(({ isLink, ...otherProps }) =>
  // eslint-disable-next-line
  isLink ? <a {...otherProps} /> : <button type="button" {...otherProps} />
)`
  height: 100%;
  min-height: 50px;
  padding: 0 18px 0 10px;
  display: flex;
  align-items: center;
  flex-grow: ${({ compact }) => (compact ? '0' : '1')};
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #393636 !important;
  cursor: pointer;
`;

const Root = styled.div`
  display: flex;
  align-items: center;

  ${is('compact')`
    width: 100%;
    height: 56px;
    justify-content: center;
    border-top: 1px solid #e9e9e9;

    @media (max-width: 700px) {
      height: 50px;
    }
  `};
`;

export default function ReplyBlock({
  compact,
  count,
  link,
  isLink,
  text,
  mini,
  className,
  onReplyClick,
}) {
  const replyButton = onReplyClick ? (
    <>
      <Splitter />
      <ReplyButton role="button" name="reply" compact={compact ? 1 : 0} onClick={onReplyClick}>
        {text}
      </ReplyButton>
    </>
  ) : (
    <>
      <Splitter />
      <Link route={`/@${link}#createComment`} passHref>
        <ReplyButton name="reply" compact={compact ? 1 : 0} isLink>
          {text}
        </ReplyButton>
      </Link>
    </>
  );

  return (
    <Root compact={compact} className={className}>
      {isLink || mini ? (
        <Link route={`/@${link}#comments`} passHref>
          <Replies
            name="link-to-replies"
            data-tooltip={tt('reply.comments_count')}
            aria-label={tt('aria_label.comments', { count })}
            isLink
            compact={compact ? 1 : 0}
            mini={mini ? 1 : 0}
          >
            <ReplyIcon name="reply" />
            <RepliesQuantity>{count}</RepliesQuantity>
          </Replies>
        </Link>
      ) : (
        <Replies
          data-tooltip={tt('reply.comments_count')}
          aria-label={tt('aria_label.comments', { count })}
          compact={compact ? 1 : 0}
          mini={mini ? 1 : 0}
        >
          <ReplyIcon name="reply" />
          <RepliesQuantity>{count}</RepliesQuantity>
        </Replies>
      )}
      {mini ? null : replyButton}
    </Root>
  );
}

ReplyBlock.propTypes = {
  compact: PropTypes.bool,
  count: PropTypes.number,
  link: PropTypes.string.isRequired,
  text: PropTypes.string,
  mini: PropTypes.bool,
  onReplyClick: PropTypes.func,
  isLink: PropTypes.bool,
};

ReplyBlock.defaultProps = {
  compact: false,
  count: 0,
  text: '',
  mini: false,
  isLink: false,

  onReplyClick: null,
};
