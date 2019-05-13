import React from 'react';
import { Link } from 'mocks/react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Userpic from 'components/common/Userpic';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled(Link)`
  position: relative;
  display: flex;
  margin-right: 10px;
  border-radius: 50%;
`;

const AuthorName = styled(Link)`
  display: block;
  margin: 3px 0;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.1;
  color: #333;
  text-decoration: none;
`;

const CommentAuthor = ({ author }) => (
  <Wrapper>
    <Avatar to={`/@${author}`} aria-label={tt('aria_label.avatar')}>
      <Userpic userId={author} size={37} />
    </Avatar>
    <AuthorName to={`/@${author}`}>{author}</AuthorName>
  </Wrapper>
);

CommentAuthor.propTypes = {
  author: PropTypes.string.isRequired,
};

export default CommentAuthor;
