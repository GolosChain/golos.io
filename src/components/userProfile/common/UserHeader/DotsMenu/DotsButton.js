import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon/index';

import DotsMenu from 'components/userProfile/common/UserHeader/DotsMenu';

const Wrapper = styled.div`
  position: relative;
  grid-area: dots;
  align-self: center;
  margin: 0 0 -5px 5px;

  @media (max-width: 576px) {
    margin: 0 0 0 5px;
  }
`;

const Dots = styled.button`
  display: flex;
  padding: 5px;
  cursor: pointer;
  color: #fff;
  outline: none;

  &:hover {
    color: #2879ff;
  }

  @media (max-width: 576px) {
    color: #333;
  }
`;

export default class DotsButton extends Component {
  static propTypes = {
    authUser: PropTypes.string,
    accountUsername: PropTypes.string.isRequired,
  };

  state = {
    menuOpen: false,
  };

  toggleMenu = () => {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    const { authUser, accountUsername } = this.props;
    const { menuOpen } = this.state;

    return (
      <Wrapper>
        {menuOpen && (
          <DotsMenu
            authUser={authUser}
            accountUsername={accountUsername}
            closeMenu={this.closeMenu}
          />
        )}
        <Dots onClick={this.toggleMenu}>
          <Icon name="dots" width="3" height="15" />
        </Dots>
      </Wrapper>
    );
  }
}
