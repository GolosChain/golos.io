import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { LANGUAGES } from 'constants/config';
import { setLocaleCookie } from 'utils/locale';

const HIDE_CHEVRON_WIDTH = 500;

const Wrapper = styled.div`
  position: relative;
  margin-right: 8px;
  cursor: pointer;
  z-index: 1;

  @media (max-width: ${HIDE_CHEVRON_WIDTH}px) {
    margin-right: 0;
  }
`;

const Current = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  font-weight: 500;
  text-transform: uppercase;
  color: #393636;
  user-select: none;
  z-index: 1;
`;

const Chevron = styled.div`
  position: absolute;
  top: 22px;
  right: 5px;
  border: 3px solid transparent;
  border-top-color: #363636;

  ${is('isOpen')`
    top: 19px;
    border-top-color: transparent;
    border-bottom-color: #363636;
  `};

  @media (max-width: ${HIDE_CHEVRON_WIDTH}px) {
    display: none;
  }
`;

const List = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 2px;
  left: -6px;
  right: -6px;
  padding: 38px 0 4px;
  border-radius: 8px;
  background: #fff;
  border-color: #3684ff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;

  ${is('isOpen')`
    opacity: 1;
    pointer-events: initial;
  `};

  @media (max-width: 500px) {
    padding-top: 46px;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  font-weight: 500;
  text-transform: uppercase;
  color: #959595;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #333;
  }

  @media (max-width: 500px) {
    height: 48px;
  }
`;

export default class LocaleSelect extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.string,
    locale: PropTypes.string.isRequired,
    changeLocale: PropTypes.func.isRequired,
    saveLocale: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUser: null,
  };

  state = {
    isOpen: false,
  };

  componentWillUnmount() {
    window.removeEventListener('click', this.onAwayClick);
  }

  onRef = el => {
    this.root = el;
  };

  onOpenClick = () => {
    this.toggle(state => ({ isOpen: !state.isOpen }));
  };

  onAwayClick = e => {
    if (!this.root.contains(e.target)) {
      this.toggle(false);
    }
  };

  handleClick = locale => () => {
    const { currentUser, changeLocale, saveLocale } = this.props;

    if (currentUser) {
      saveLocale(locale);
    } else {
      setLocaleCookie(locale);
      changeLocale(locale);
    }

    this.toggle(false);
  };

  toggle(show) {
    if (show) {
      window.addEventListener('click', this.onAwayClick);
    } else {
      window.removeEventListener('click', this.onAwayClick);
    }

    this.setState({
      isOpen: show,
    });
  }

  render() {
    const { locale } = this.props;
    const { isOpen } = this.state;

    return (
      <Wrapper ref={this.onRef}>
        <Current onClick={this.onOpenClick}>
          {LANGUAGES[locale].shortValue}
          <Chevron isOpen={isOpen} />
        </Current>
        <List isOpen={isOpen}>
          {Object.keys(LANGUAGES)
            .filter(lang => lang !== locale)
            .map(lang => (
              <ListItem key={lang} onClick={this.handleClick(lang)}>
                {LANGUAGES[lang].shortValue}
              </ListItem>
            ))}
        </List>
      </Wrapper>
    );
  }
}
