import React, { PureComponent } from 'react';
import styled from 'styled-components';

import SmartLink from '../SmartLink';

const Wrapper = styled.span`
  & a {
    color: #333;
    text-decoration: underline;

    &:hover {
      color: #0067a9;
    }
  }
`;

export default class Linkify extends PureComponent {
  render() {
    const { children } = this.props;

    const parts = [];

    let prevPosition = 0;

    children.replace(/https?:\/\/[^\s)]+/g, (url, position) => {
      if (position > prevPosition) {
        const stringWithoutLink = children.substring(prevPosition, position);

        parts.push(addLinkToUser(stringWithoutLink));
      }

      parts.push(
        <a key={position} href={url} target="_blank">
          {url}
        </a>
      );

      prevPosition = position + url.length;
    });

    if (prevPosition < children.length) {
      const tailString = children.substring(prevPosition, children.length);

      parts.push(addLinkToUser(tailString));
    }

    return <Wrapper>{parts}</Wrapper>;
  }
}

function validateAccountName(str) {
  // TODO: Implement
  return true;
}

function addLinkToUser(str) {
  const parts = [];

  let prevPosition = 0;

  str.replace(/@[a-z][a-z0-9.-]+[a-z0-9]/gi, (accountName, position) => {
    if (position > prevPosition) {
      parts.push(str.substring(prevPosition, position));
    }

    if (validateAccountName(accountName.substring(1)) === null) {
      parts.push(
        <SmartLink
          key={position}
          route="profile"
          params={{ username: accountName.replace(/^@/, '') }}
        >
          {accountName}
        </SmartLink>
      );
    } else {
      parts.push(accountName);
    }

    prevPosition = position + accountName.length;
  });

  if (prevPosition < str.length) {
    parts.push(str.substring(prevPosition, str.length));
  }

  return parts;
}
