import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import SmartLink from 'components/common/SmartLink';

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

const ReLink = ({ title, onClick, ...props }) => (
  <Wrapper>
    <TitleIcon name="comment" />
    {tt('g.re2')}
    :&nbsp;
    <SmartLink route="post" {...props}>
      <TitleLink onClick={onClick}>{title}</TitleLink>
    </SmartLink>
  </Wrapper>
);

ReLink.propTypes = {
  title: PropTypes.string.isRequired,
  params: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
};

export default ReLink;
