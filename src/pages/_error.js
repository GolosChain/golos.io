import React, { Component } from 'react';
import { Link } from 'shared/routes';
import PropTypes from 'prop-types';
import Head from 'next/head';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import { HEADER_HEIGHT } from 'constants/communUI';

const PAD_BREAK_POINT = 768;
const MOBILE_BREAK_POINT = 576;
const MARGIN_DESKTOP = 40;
const MARGIN_PAD = 15;

const ErrorBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  min-height: calc(100vh - ${HEADER_HEIGHT}px - 58px - ${MARGIN_PAD * 2}px);
  margin: ${MARGIN_PAD}px;
  text-align: center;
  color: #000;
  background-color: #fff;

  @media (min-width: ${PAD_BREAK_POINT}px) {
    min-height: calc(100vh - ${HEADER_HEIGHT}px - 58px - ${MARGIN_DESKTOP * 2}px);
    margin: ${MARGIN_DESKTOP}px;
  }
`;

const MainImg = styled.img`
  width: fit-content;
  max-width: 100%;
`;

const Title = styled.h1`
  width: 270px;
  max-width: 100%;
  margin: 0;
  font-size: 40px;
  font-weight: 500;
  text-align: center;

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    margin-top: 30px;
    font-size: 25px;
  }
`;

const SubTitle = styled.p`
  width: 570px;
  max-width: 100%;
  margin-top: 15px;
  font-size: 15px;
  color: #757575;

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    margin-top: 30px;
    font-size: 13px;

    ${is('marginBottom')`
      margin-bottom: 30px;
    `}
  }
`;

const LinksList = styled.ul`
  display: flex;
  margin-top: 40px;

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    margin-top: 30px;
  }
`;

const ListItem = styled.li`
  font-size: 14px;
  text-transform: uppercase;

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    margin-bottom: 20px;
    font-size: 12px;
  }
`;

const RouterLink = styled(Link)``;

const RealLink = styled.a`
  ${({ theme }) => `
    text-decoration: underline;
    color: ${theme.colors.contextBlue};
    
    &:hover,
    &:focus {
      text-decoration: none;
      color: ${theme.colors.contextBlue};
    }
  `};
`;

const ItemsDividers = styled.li`
  display: block;
  width: 1px;
  height: 22px;
  margin: 0 20px;
  border: solid 1px #e1e1e1;

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    display: none;
  }
`;

export default class ErrorPage extends Component {
  static displayName = 'ErrorPage';

  static getInitialProps({ res, err }) {
    let statusCode = null;

    if (res) {
      statusCode = res.statusCode;
    } else if (err) {
      statusCode = err.statusCode;
    }

    return {
      namespacesRequired: [],
      statusCode,
    };
  }

  static propTypes = {
    statusCode: PropTypes.number,
  };

  static defaultProps = {
    statusCode: null,
  };

  render() {
    const { statusCode } = this.props;

    let content = (
      <>
        <MainImg src="/static/images/errors/404.svg" />
        <Title>{tt('error_page.oops')}</Title>
        <SubTitle>{tt('error_page.text')}</SubTitle>
        <LinksList>
          <ListItem>
            <RouterLink route="created" passHref>
              <RealLink>{tt('main_menu.new')}</RealLink>
            </RouterLink>
          </ListItem>
          <ItemsDividers />
          <ListItem>
            <RouterLink route="hot" passHref>
              <RealLink>{tt('main_menu.hot')}</RealLink>
            </RouterLink>
          </ListItem>
          <ItemsDividers />
          <ListItem>
            <RouterLink route="trending" passHref>
              <RealLink>{tt('main_menu.trending')}</RealLink>
            </RouterLink>
          </ListItem>
        </LinksList>
      </>
    );

    if (statusCode !== 404) {
      content = (
        <>
          <Title>
            {tt('g.error')}: {statusCode}
          </Title>
          <SubTitle marginBottom>{tt('error_page.text')}</SubTitle>
        </>
      );
    }

    return (
      <ErrorBlock>
        <Head>
          <title>
            {tt('g.error')}: {statusCode}
          </title>
        </Head>
        {content}
      </ErrorBlock>
    );
  }
}
