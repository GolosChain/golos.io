import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import routes, { Link } from 'shared/routes';

const Wrapper = styled.div`
  position: relative;
`;

const SelectLike = styled.div`
  position: relative;
  z-index: 13;
  display: flex;
  height: 34px;
  padding: 0 16px;
  align-items: center;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 500px) {
    height: 48px;
  }
`;

const Chevron = styled.div`
  margin-left: 8px;
  margin-top: 1px;
  border: 3px solid transparent;
  border-top-color: #363636;

  ${is('open')`
    margin-top: -4px;
    transform: rotate(180deg);
  `}
`;

const Placeholder = styled.div`
  font-weight: 300;
  color: #888;
`;

const List = styled.ul`
  position: absolute;
  top: 0;
  left: 3px;
  z-index: 12;
  min-width: 100%;
  padding: 34px 0 4px 0;
  margin: 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  animation: fade-in 0.25s;

  @media (max-width: 500px) {
    padding-top: 48px;
  }
`;

const Li = styled.li`
  list-style: none;
`;

const ItemLink = styled.a`
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 16px;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 14px;
  color: #393636;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: #000;
  }

  @media (max-width: 500px) {
    height: 48px;
  }
`;

export default class LinkSelect extends PureComponent {
  state = {
    isOpen: false,
  };

  root = createRef();

  componentWillUnmount() {
    window.removeEventListener('click', this.onAwayClick);
  }

  toggleMenu(open) {
    this.setState({
      isOpen: open,
    });

    if (open) {
      window.addEventListener('click', this.onAwayClick);
    } else {
      window.removeEventListener('click', this.onAwayClick);
    }
  }

  onSelectClick = e => {
    e.preventDefault();

    this.toggleMenu(!this.state.isOpen);
  };

  onAwayClick = e => {
    if (!this.root.current.contains(e.target)) {
      this.toggleMenu(false);
    }
  };

  onLinkClick = () => {
    this.toggleMenu(false);
  };

  onListRef = el => {
    if (el && el.scrollIntoViewIfNeeded) {
      el.scrollIntoViewIfNeeded();
    }
  };

  render() {
    const { asPath, links, placeholder, className } = this.props;
    const { isOpen } = this.state;

    const selectedOption = links.find(
      option =>
        routes.findAndGetUrls(option.route, option.params)?.urls?.as === asPath ||
        (option.index && asPath === '/')
    );

    return (
      <Wrapper ref={this.root} className={className}>
        <SelectLike onClick={this.onSelectClick}>
          {selectedOption ? (
            selectedOption.text
          ) : (
            <Placeholder>{placeholder || tt('g.select')}</Placeholder>
          )}
          <Chevron open={isOpen} />
        </SelectLike>
        {isOpen ? (
          <List ref={this.onListRef}>
            {links
              .filter(option => !selectedOption || option.text !== selectedOption.text)
              .map(option => (
                <Li key={option.text} onClick={this.onLinkClick}>
                  <Link route={option.route} params={option.params}>
                    <ItemLink>{option.text}</ItemLink>
                  </Link>
                </Li>
              ))}
          </List>
        ) : null}
      </Wrapper>
    );
  }
}
