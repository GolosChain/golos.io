import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';
import { ToggleFeature } from '@flopflip/react-redux';

import {
  CONTAINER_FULL_WIDTH,
  CONTAINER_MOBILE_WIDTH,
  CONTAINER_BASE_MARGIN,
  CONTAINER_MOBILE_MARGIN,
} from 'constants/container';
import { SHOW_MODAL_LOGIN, SHOW_MODAL_SIGNUP } from 'store/constants/modalTypes';
import { Link } from 'shared/routes';
import { HEADER_SEARCH, HEADER_SIGN_IN, HEADER_SIGN_UP } from 'shared/feature-flags';

import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';
import ScrollFix from 'components/common/ScrollFix';
import Popover from 'components/header/Popover/Popover';

import Menu from '../Menu';
import IconWrapper from '../IconWrapper';
import NotificationsWindow from '../NotificationsWindow';
// eslint-disable-next-line import/no-named-as-default
import LocaleSelect from '../LocaleSelect';
import AccountInfo from '../AccountInfo';
import AccountInfoMobile from '../AccountInfoMobile';
import NotificationsCounter from '../NotificationsCounter';

const Wrapper = styled.div``;

// Technical work
const TechnicalWork = styled.div`
  display: flex;
  flex-direction: column;
  background: #2196f3;
  color: white;
`;

const TechnicalContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${CONTAINER_FULL_WIDTH}px;
  margin: 0 auto;

  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    margin: 0 20px;
  }

  ${is('center')`
    justify-content: center;
  `}
`;

const TechnicalStatus = styled.span`
  ${is('ready')`
    background: green;
  `}
`;
//

const ScrollFixStyled = styled(ScrollFix)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 276px; /* 60px; TODO: before technical work */
  background: #fff;
  z-index: 15;

  /* delete TODO: before technical work */
  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    height: 351px;
  }

  ${is('isFixed')`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #e9e9e9;
  `};
`;

const HeaderStub = styled.div`
  height: 276px; /* 60px; TODO: before technical work */
`;

const ContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  max-width: ${CONTAINER_FULL_WIDTH}px;
  margin: 0 auto;

  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    width: 100%;
    margin: 0;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const LocaleWrapper = styled(IconWrapper)`
  position: relative;
  width: unset;
  z-index: 2;

  @media (max-width: 345px) {
    display: none;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 10px;
  margin-left: ${CONTAINER_BASE_MARGIN - 10}px;

  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin-left: ${CONTAINER_MOBILE_MARGIN - 10}px;
  }

  @media (max-width: 400px) {
    padding: 10px 8px;
  }

  @media (max-width: 340px) {
    padding-right: 4px;
  }
`;

const LogoIcon = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: url('/images/header/logo-golos.svg') center no-repeat;
  background-size: contain;
  color: #2879ff;
`;

const LogoText = styled.div`
  flex-shrink: 0;
  margin-left: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #393636;
`;

const SearchBlock = styled.a`
  display: flex;
  flex-grow: 1;
  align-items: center;

  @media (max-width: 768px) {
    flex-grow: 0;
  }

  ${is('mobile')`
    margin: 0;
    padding: 8px 10px;
  `};
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  border: none;
  background: none;
  font-size: 16px;
  outline: none;
`;

const SearchIcon = styled(Icon)`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: #393636;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  opacity: 1;
  transition: opacity 0.3s;
  will-change: opacity;

  ${is('hidden')`
    opacity: 0;
  `};
`;

const SignUp = styled(Button)`
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    color: #fff;
    background-color: #0e69ff;
  }
`;

const SignIn = styled(Button)`
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    color: #393636;
    background-color: #fff !important;
    border: 1px solid #c0c0c0;
  }
`;

const NewPostLink = styled.a`
  display: flex;
  height: 48px;
  align-items: center;
  margin: 0 10px;

  @media (max-width: 576px) {
    display: none;
  }
`;

const MobileNewPostLink = styled(IconWrapper.withComponent(styled.a``))`
  color: #393636;

  @media (min-width: 577px) {
    display: none;
  }
`;

const NewPostIcon = styled(Icon).attrs({ name: 'new-post' })`
  width: 16px;
  height: 16px;
  margin-right: 7px;

  ${is('mobile')`
    width: 20px;
    height: 20px;
    margin: 0;
  `}
`;

const Dots = styled(Icon)`
  display: block;
  color: #393636;
  user-select: none;
`;

const DotsWrapper = styled(IconWrapper)`
  &:hover > ${Dots} {
    color: #2879ff;
  }

  ${is('active')`
    & > ${Dots} {
      color: #2879ff;
    }
  `};

  ${is('isTablet')`
    padding: 10px 20px;
  `};

  ${is('isMobile')`
    padding: 10px 16px;
    
    @media (max-width: 400px) {
      padding: 10px 8px;
    }
  `};
`;

export default class Header extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    isAuthorized: PropTypes.bool.isRequired,
    isAutoLogging: PropTypes.bool.isRequired,
    screenType: PropTypes.string.isRequired,
    openModal: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: '',
  };

  state = {
    isMenuOpen: false,
    isNotificationsOpen: false,
    // eslint-disable-next-line react/destructuring-assignment
    waitAuth: this.props.isAutoLogging,
  };

  timeoutId = null;

  accountRef = createRef();

  dotsRef = createRef();

  notificationsIconRef = createRef();

  componentDidMount() {
    const { waitAuth } = this.state;

    if (waitAuth) {
      this.timeoutId = setTimeout(() => {
        this.setState({
          waitAuth: false,
        });
      }, 2000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  onLoginClick = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_LOGIN);
  };

  onLogoutClick = e => {
    e.preventDefault();
    const { logout } = this.props;
    logout();
  };

  onMenuToggle = () => {
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen,
    }));
  };

  onNotificationsToggle = async () => {
    const { isNotificationsOpen } = this.state;

    this.setState({
      isNotificationsOpen: !isNotificationsOpen,
    });
  };

  onNotificationsMenuClose = () => {
    this.setState({
      isNotificationsOpen: false,
    });
  };

  openSignUp = () => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SIGNUP);
  };

  renderLocaleBlock = () => (
    <LocaleWrapper>
      <LocaleSelect />
    </LocaleWrapper>
  );

  renderAuthorizedPart() {
    const { screenType } = this.props;
    const { isNotificationsOpen } = this.state;

    return (
      <>
        <Link route="submit" passHref>
          <NewPostLink name="header__create-post">
            <Button as="span">
              <NewPostIcon />
              {tt('g.create_post')}
            </Button>
          </NewPostLink>
        </Link>
        <Link route="submit" passHref>
          <MobileNewPostLink as="a" aria-label={tt('g.create_post')} name="header__create-post">
            <NewPostIcon mobile={1} />
          </MobileNewPostLink>
        </Link>
        <NotificationsCounter
          isOpen={isNotificationsOpen}
          iconRef={this.notificationsIconRef}
          onToggle={this.onNotificationsToggle}
        />
        {this.renderLocaleBlock()}
        {screenType === 'desktop' ? <AccountInfo /> : <AccountInfoMobile />}
      </>
    );
  }

  renderLogo() {
    const { screenType } = this.props;
    const isDesktop = screenType === 'desktop';

    return (
      <Link route="home" passHref>
        <LogoLink aria-label={tt('aria_label.header_logo')}>
          <LogoIcon />
          {isDesktop ? <LogoText>GOLOS</LogoText> : null}
        </LogoLink>
      </Link>
    );
  }

  renderSearch() {
    const { screenType } = this.props;
    const isDesktop = screenType === 'desktop';

    return (
      <ToggleFeature flag={HEADER_SEARCH}>
        <SearchBlock href="/static/search.html" aria-label={tt('g.search')}>
          {isDesktop ? <SearchInput /> : null}
          <IconWrapper>
            <SearchIcon name="search" />
          </IconWrapper>
        </SearchBlock>
      </ToggleFeature>
    );
  }

  renderRight() {
    const { isAuthorized, screenType } = this.props;
    const { isMenuOpen, waitAuth } = this.state;

    const isMobile = screenType === 'mobile' || screenType === 'landscapeMobile';

    let authBlock;

    if (isAuthorized) {
      authBlock = this.renderAuthorizedPart();
    } else {
      authBlock = (
        <>
          {this.renderLocaleBlock()}
          <Buttons hidden={waitAuth}>
            <ToggleFeature flag={HEADER_SIGN_UP}>
              <SignUp name="header__sigh-up" onClick={this.openSignUp}>
                {tt('g.sign_up')}
              </SignUp>
            </ToggleFeature>
            <ToggleFeature flag={HEADER_SIGN_IN}>
              {isMobile ? null : (
                <SignIn light name="header__register" onClick={this.onLoginClick}>
                  {tt('g.login')}
                </SignIn>
              )}
            </ToggleFeature>
          </Buttons>
        </>
      );
    }

    return (
      <Right>
        {authBlock}
        <DotsWrapper
          as="button"
          type="button"
          name="header__more-actions"
          aria-label={tt('aria_label.additional_menu')}
          ref={this.dotsRef}
          active={isMenuOpen}
          isTablet={screenType === 'tablet' ? 1 : 0}
          isMobile={isMobile ? 1 : 0}
          onClick={this.onMenuToggle}
        >
          <Dots name="dots" width="4" height="20" />
        </DotsWrapper>
      </Right>
    );
  }

  renderNotifications() {
    const { screenType } = this.props;
    const { isNotificationsOpen } = this.state;

    const isMobile = screenType === 'mobile' || screenType === 'landscapeMobile';

    if (isNotificationsOpen) {
      return (
        <Popover
          notificationMobile={isMobile}
          target={this.notificationsIconRef.current}
          onClose={this.onNotificationsMenuClose}
        >
          <NotificationsWindow isMobile={isMobile} onClose={this.onNotificationsMenuClose} />
        </Popover>
      );
    }
  }

  renderMenu() {
    const { userId, screenType } = this.props;
    const { isMenuOpen } = this.state;

    const isDesktop = screenType === 'desktop';
    const isMobile = screenType === 'mobile' || screenType === 'landscapeMobile';

    if (isMenuOpen) {
      return (
        <Popover menuMobile={!isDesktop} target={this.dotsRef.current} onClose={this.onMenuToggle}>
          <Menu
            isMobile={isMobile}
            userId={userId}
            onClose={this.onMenuToggle}
            onLoginClick={this.onLoginClick}
            onLogoutClick={this.onLogoutClick}
          />
        </Popover>
      );
    }
  }

  // TODO: before technical work
  renderTechnicalStatus(value) {
    const ready = process.env.TECHNICAL_STATUSES.includes(value);

    return (
      <TechnicalStatus ready={ready}>
        {ready ? tt('technical_work.statuses.ready') : tt('technical_work.statuses.maintance')}
      </TechnicalStatus>
    );
  }

  render() {
    const { screenType } = this.props;
    const isDesktop = screenType === 'desktop';

    return (
      <Wrapper>
        <ScrollFixStyled isFixed={isDesktop ? 1 : 0}>
          <TechnicalWork>
            <TechnicalContainerWrapper center style={{ height: '50px' }}>
              {tt('technical_work.top')}
            </TechnicalContainerWrapper>
            <TechnicalContainerWrapper>
              <div>{tt('technical_work.state')}</div>
              <div>
                <ul>
                  <li>
                    <Interpolate
                      with={{
                        status: this.renderTechnicalStatus(1),
                      }}
                    >
                      {tt('technical_work.steps.first', {
                        interpolate: false,
                      })}
                    </Interpolate>
                  </li>
                  <li>
                    <Interpolate
                      with={{
                        status: this.renderTechnicalStatus(2),
                        link: (
                          <a href="https://explorer.cyberway.io/" style={{ color: '#1d0050' }}>
                            https://explorer.cyberway.io/
                          </a>
                        ),
                      }}
                    >
                      {tt('technical_work.steps.second', {
                        interpolate: false,
                      })}
                    </Interpolate>
                  </li>
                  <li>
                    <Interpolate
                      with={{
                        status: this.renderTechnicalStatus(3),
                      }}
                    >
                      {tt('technical_work.steps.third', {
                        interpolate: false,
                      })}
                    </Interpolate>
                  </li>
                  <li>
                    <Interpolate
                      with={{
                        status: this.renderTechnicalStatus(4),
                      }}
                    >
                      {tt('technical_work.steps.fourth', {
                        interpolate: false,
                      })}
                    </Interpolate>
                  </li>
                </ul>
              </div>
              <div>
                <ul>
                  <li>
                    <Interpolate
                      with={{
                        status: this.renderTechnicalStatus(5),
                      }}
                    >
                      {tt('technical_work.steps.fifth', {
                        interpolate: false,
                      })}
                    </Interpolate>
                  </li>
                  <li>
                    <Interpolate
                      with={{
                        status: this.renderTechnicalStatus(6),
                      }}
                    >
                      {tt('technical_work.steps.sixth', {
                        interpolate: false,
                      })}
                    </Interpolate>
                  </li>
                  <li>
                    <Interpolate
                      with={{
                        status: this.renderTechnicalStatus(7),
                      }}
                    >
                      {tt('technical_work.steps.seventh', {
                        interpolate: false,
                      })}
                    </Interpolate>
                  </li>
                </ul>
              </div>
            </TechnicalContainerWrapper>
            <TechnicalContainerWrapper center style={{ height: '65px' }}>
              {tt('technical_work.updates')}
              <br />
              {tt('technical_work.yours')}
            </TechnicalContainerWrapper>
          </TechnicalWork>
          <ContainerWrapper>
            {this.renderLogo()}
            {screenType === 'tablet' ? <Filler /> : null}
            {this.renderSearch()}
            {this.renderRight()}
          </ContainerWrapper>
          {this.renderNotifications()}
          {this.renderMenu()}
        </ScrollFixStyled>
        {isDesktop ? <HeaderStub /> : null}
      </Wrapper>
    );
  }
}
