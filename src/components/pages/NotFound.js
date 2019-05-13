import React from 'react';
import styled from 'styled-components';
import Icon from 'components/elements/Icon';
import { APP_NAME, APP_ICON } from 'constants/config';

const Link = styled.a``;

class NotFound extends React.Component {
  render() {
    return (
      <div>
        <div className="Header__top header">
          <div className="columns">
            <ul className="menu" style={{ alignItems: 'center' }}>
              <li className="Header__top-logo">
                <Link to="/">
                  <Icon name={APP_ICON} size="2x" />
                </Link>
              </li>
              <li className="Header__top-steemit show-for-medium noPrint">
                <a href="/">{APP_NAME}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="NotFound float-center">
          <div>
            <Icon name={APP_ICON} size="4x" />
            <h4 className="NotFound__header">Sorry! This page doesn't exist.</h4>
            <p>
              Not to worry. You can head back to{' '}
              <a style={{ fontWeight: 800 }} href="/">
                our homepage
              </a>
              , or check out some great posts.
            </p>
            <ul className="NotFound__menu">
              <li>
                <a href="/created">new posts</a>
              </li>
              <li>
                <a href="/hot">hot posts</a>
              </li>
              <li>
                <a href="/trending">trending posts</a>
              </li>
              <li>
                <a href="/promoted">promoted posts</a>
              </li>
              <li>
                <a href="/active">active posts</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default {
  path: '*',
  component: NotFound,
};
