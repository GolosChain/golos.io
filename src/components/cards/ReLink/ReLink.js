import React from 'react';
import { Link } from 'shared/routes';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

const Wrapper = styled.div`
  padding-right: 10px;
  display: flex;
  align-items: center;
  line-height: 29px;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 20px;
  font-weight: bold;
  color: #212121;
  overflow: hidden;
`;

const TitleIcon = styled(Icon)`
  position: relative;
  height: 20px;
  min-width: 24px;
  margin-right: 6px;
  margin-bottom: -3px;
`;

const TitleLink = styled.a`
  color: #212121 !important;
  text-decoration: underline;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReLink = ({ fullParentURL, title }) => (
  <Wrapper>
    <TitleIcon name="comment" />
    {tt('g.re2')}
    :&nbsp;
    <Link route={fullParentURL} passHref>
      <TitleLink>{title}</TitleLink>
    </Link>
  </Wrapper>
);

ReLink.propTypes = {
  fullParentURL: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ReLink;
