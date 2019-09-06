import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Userpic from 'components/common/Userpic';
import SmartLink from 'components/common/SmartLink';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.a`
  position: relative;
  display: flex;
  margin-right: 10px;
  border-radius: 50%;
`;

const AuthorName = styled.a`
  display: block;
  margin: 3px 0;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.1;
  color: #333;
  text-decoration: none;
`;

export default function CommentAuthor({ author }) {
  return (
    <Wrapper>
      <SmartLink route="profile" params={{ username: author }}>
        <Avatar aria-label={tt('aria_label.avatar')}>
          <Userpic userId={author} size={37} />
        </Avatar>
      </SmartLink>
      <SmartLink route="profile" params={{ username: author }}>
        <AuthorName>{author}</AuthorName>
      </SmartLink>
    </Wrapper>
  );
}

CommentAuthor.propTypes = {
  author: PropTypes.string.isRequired,
};
