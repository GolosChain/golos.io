import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Head from 'next/head';
import HTTPStatus from 'http-status';

const ErrorBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: calc(100vh - 60px - 58px);
  text-align: center;
  color: #000;
  background-color: #fff;
`;

const Desc = styled.div`
  display: flex;
  align-items: center;
  height: 49px;
  line-height: 49px;
  vertical-align: middle;
  text-align: left;
`;

const H1 = styled.h1`
  display: inline-block;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  padding: 10px 23px 10px 0;
  margin: 0 20px 0 0;
  vertical-align: top;
  font-size: 24px;
  font-weight: 600;
`;

const H2 = styled.h2`
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: inherit;
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

    const title =
      statusCode === 404
        ? 'This page could not be found'
        : HTTPStatus[statusCode] || 'An unexpected error has occurred';

    return (
      <ErrorBlock>
        <Head>
          <title>
            {statusCode}: {title}
          </title>
        </Head>
        <Desc>
          <style dangerouslySetInnerHTML={{ __html: 'body { margin: 0 }' }} />
          {statusCode ? <H1>{statusCode}</H1> : null}
          <Desc>
            <H2>{title}.</H2>
          </Desc>
        </Desc>
      </ErrorBlock>
    );
  }
}
