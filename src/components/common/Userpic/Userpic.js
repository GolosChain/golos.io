import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cn from 'classnames';

import { proxyImage } from 'utils/images';

const DEFAULT_AVATAR = '/images/user.png';

export const UserPicBlock = styled.div`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
`;

export default class Userpic extends PureComponent {
  static propTypes = {
    avatarUrl: PropTypes.string,
    size: PropTypes.number,
    ariaLabel: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    avatarUrl: null,
    size: 48,
  };

  render() {
    const { avatarUrl, size, ariaLabel, className, onClick } = this.props;
    let url;

    if (avatarUrl && /^(?:https?:)\/\//.test(avatarUrl)) {
      url = proxyImage(avatarUrl, size && size > 120 ? '320x320' : '120x120');
    } else {
      url = DEFAULT_AVATAR;
    }

    const style = {
      width: size,
      height: size,
      backgroundImage: `url("${url}")`,
    };

    return (
      <UserPicBlock
        className={cn('Userpic', className)}
        aria-label={ariaLabel}
        style={style}
        onClick={onClick}
      />
    );
  }
}
