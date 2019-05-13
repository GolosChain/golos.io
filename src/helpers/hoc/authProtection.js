import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import { currentUserIdSelector } from 'store/selectors/auth';
import { uiSelector, dataSelector } from 'store/selectors/common';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 22px;
  color: #333;
  opacity: 0;
  animation: fade-in 0.5s forwards;
  animation-delay: 0.3s;
`;

const Loader = styled(LoadingIndicator).attrs({ type: 'circle', center: true, size: 40 })`
  margin: 30px 0 20px;
`;

export default (equalFunc = defaultEqualFunc) => Comp =>
  connect(state => ({
    isAutoLogging: dataSelector(['auth', 'isAutoLogging'])(state),
    authorizedUserId: currentUserIdSelector(state),
    isSSR: uiSelector(['mode', 'isSSR'])(state),
  }))(
    class NotAuthorized extends Component {
      static getInitialProps(...args) {
        if (Comp.getInitialProps) {
          return Comp.getInitialProps(...args);
        }
      }

      render() {
        const { isAutoLogging, authorizedUserId, isSSR } = this.props;

        if (!authorizedUserId && isAutoLogging) {
          return <Loader />;
        }

        if (!authorizedUserId || isSSR) {
          return <Root>{tt('auth_protection.need_auth')}</Root>;
        }

        if (equalFunc && !equalFunc(this.props, authorizedUserId)) {
          return <Root>{tt('auth_protection.not_allowed')}</Root>;
        }

        return <Comp {...this.props} />;
      }
    }
  );

function defaultEqualFunc(props, userId) {
  try {
    return props.userId === userId;
  } catch (err) {
    return false;
  }
}
