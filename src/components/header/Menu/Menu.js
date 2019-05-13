import React, { PureComponent, Fragment } from 'react';
import { Link } from 'shared/routes';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import { logOutboundLinkClickAnalytics } from 'helpers/gaLogs';

const Ul = styled.ul`
  padding: 5px 0 6px;
  margin: 0;
`;

const Li = styled.li`
  list-style: none;
  cursor: pointer;
`;

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  height: 50px;
  padding-right: 20px;
  font-size: 14px;
  color: #333 !important;
  background-color: #fff;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MenuButton = styled(MenuLink).attrs({
  as: 'button',
  type: 'button',
})`
  width: 100%;
  text-transform: none;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 63px;
`;

const IconStyled = styled(Icon)`
  flex-shrink: 0;
  color: #393636;
`;

export default class Menu extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired,
  };

  loggedInItems = [
    {
      link: `/@${this.props.userId}/wallet`,
      icon: 'wallet2',
      text: tt('g.wallet'),
      width: 18,
      height: 18,
    },
    // {
    //   link: '/market',
    //   icon: 'transfer',
    //   text: tt('g.market'),
    //   width: 20,
    //   height: 16,
    // },
    // {
    //   link: '//explorer.golos.io',
    //   icon: 'golos_explorer',
    //   text: 'Golos Explorer',
    //   width: 32,
    //   height: 19,
    // },
    {
      link: '/~witnesses',
      icon: 'delegates',
      text: tt('navigation.delegates'),
      width: 22,
      height: 16,
    },
    {
      link: tt('link_to.telegram'),
      icon: 'technical-support',
      text: tt('navigation.technical_support'),
      width: 25,
      height: 26,
    },
    {
      link: `/@${this.props.userId}/settings`,
      icon: 'settings-cogwheel',
      text: tt('g.settings'),
      width: 22,
      height: 22,
    },
    {
      icon: 'logout',
      text: tt('g.logout'),
      onClick: this.props.onLogoutClick,
      width: 18,
      height: 19,
      isButton: true,
    },
  ];

  loggedOutItems = [
    // {
    //   link: '/welcome',
    //   icon: 'hand',
    //   text: tt('navigation.welcome'),
    //   width: 20,
    //   height: 25,
    // },
    // {
    //   link: '/faq',
    //   icon: 'round-question',
    //   text: tt('g.questions_answers'),
    //   width: 20,
    //   height: 20,
    // },
    // {
    //   link: '/market',
    //   icon: 'transfer',
    //   text: tt('g.market'),
    //   width: 20,
    //   height: 16,
    // },
    // {
    //   link: '//explorer.golos.io',
    //   icon: 'golos_explorer',
    //   text: 'Golos Explorer',
    //   width: 32,
    //   height: 19,
    // },
    {
      link: '/~witnesses',
      icon: 'delegates',
      text: tt('navigation.delegates'),
      width: 22,
      height: 16,
    },
    {
      link: tt('link_to.telegram'),
      icon: 'technical-support',
      text: tt('navigation.technical_support'),
      width: 25,
      height: 26,
    },
    {
      icon: 'login-normal',
      text: tt('g.login'),
      hideOnDesktop: true,
      onClick: this.props.onLoginClick,
      width: 18,
      height: 19,
      isButton: true,
    },
  ];

  onItemClick = link => {
    const { onClose } = this.props;
    if (link.startsWith('//')) {
      logOutboundLinkClickAnalytics(`https:${link}`);
    }
    onClose();
  };

  render() {
    const { userId, isMobile } = this.props;
    const menuItems = userId ? this.loggedInItems : this.loggedOutItems;

    return (
      <Ul>
        {menuItems.map(
          (
            {
              link = '',
              target,
              icon,
              text,
              hideOnDesktop = false,
              onClick,
              width,
              height,
              isButton,
            },
            i
          ) => (
            <Fragment key={icon}>
              {!isMobile && hideOnDesktop ? null : (
                <Li aria-label={text} onClick={() => this.onItemClick(link)}>
                  {isButton ? (
                    <MenuButton onClick={onClick}>
                      <IconWrapper>
                        <IconStyled name={icon} width={width} height={height} />
                      </IconWrapper>
                      {text}
                    </MenuButton>
                  ) : (
                    <Link route={link} passHref>
                      <MenuLink target={link.startsWith('//') ? '_blank' : null}>
                        <IconWrapper>
                          <IconStyled name={icon} width={width} height={height} />
                        </IconWrapper>
                        {text}
                      </MenuLink>
                    </Link>
                  )}
                </Li>
              )}
            </Fragment>
          )
        )}
      </Ul>
    );
  }
}
