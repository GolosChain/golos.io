import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import { isEmpty } from 'ramda';

import SimpleInput from 'components/golos-ui/SimpleInput';
import keyCodes from 'utils/keyCodes';
import { getScrollElement } from 'helpers/window';

const MIN_SYMBOLS = 2;
const MAX_VARIANTS = 5;

const Wrapper = styled.label`
  position: relative;
  display: inline-flex;

  ${is('block')`
    display: flex;
  `};
`;

const Sign = styled.div`
  flex-shrink: 0;
  width: 35px;
  border: 1px solid #e1e1e1;
  border-right: none;
  border-radius: 6px 0 0 6px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #333;
  background: #e1e1e1;
  transition: border-color 0.25s;
  order: 1;

  ${is('open')`
    border-radius: 6px 0 0 0;
  `};

  ${is('error')`
    border-color: #ff7d7d;
  `};

  &::after {
    content: '@';
  }
`;

const SimpleInputStyled = styled(SimpleInput)`
  border-radius: 0 6px 6px 0;
  order: 2;

  ${is('open')`
    border-radius: 0 6px 0 0;
  `};

  ${is('error')`
    border-color: #ff7d7d;
  `};

  &:disabled {
    background: #f2f2f2;
  }

  &:focus + ${Sign} {
    border-color: #8a8a8a;
  }
`;

const Autocomplete = styled.ul`
  position: absolute;
  padding: 0 0 5px;
  margin: -1px 0 4px;
  border: 1px solid #aeaeae;
  border-radius: 0 0 8px 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  user-select: none;
  z-index: 500;
  animation: from-up 0.12s;
`;

const Item = styled.li`
  padding: 5px 14px;
  list-style: none;
  white-space: nowrap;
  font-size: 14px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: none;
  cursor: pointer;
  user-select: none;
  transition: color 0.1s, background-color 0.1s;

  &:hover {
    color: #333;
    background: #f0f0f0;
  }

  ${is('selected')`
    color: #333 !important;
    background: #b3d2f0 !important;
  `};
`;

const Dots = styled.div`
  padding: 0 15px 2px;

  &::after {
    content: '...';
  }
`;

const AccountId = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #555;
`;

export default class AccountNameInput extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    suggestNames: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    userId: this.props.value || '',
    username: this.props.value || '',
    isFocus: false,
    isOpen: false,
    index: null,
    items: null,
    autocompleteList: null,
    popoverPos: null,
  };

  repositionInterval = null;
  _loadId = 0;
  _loadedId = 0;

  componentDidMount() {
    this._mount = document.getElementById('__next');
    this.repositionInterval = setInterval(this.reposition, 100);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { userId } = this.state;

    if (nextProps.value !== userId) {
      this.setState({
        userId,
        username: userId,
      });
    }
  }

  componentWillUnmount() {
    if (this._listen) {
      window.removeEventListener('scroll', this.repositionLazy);
      window.removeEventListener('resize', this.repositionLazy);
    }

    clearInterval(this.repositionInterval);
    this.repositionLazy.cancel();
    this.load.cancel();

    if (this.unbindBoxScroll) {
      this.unbindBoxScroll();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;

    if (this.wrapper && !prevState.isOpen && isOpen) {
      if (!this._listen) {
        this._listen = true;
        window.addEventListener('scroll', this.repositionLazy);
        window.addEventListener('resize', this.repositionLazy);
      }

      this.reposition();
    }
  }

  reposition = () => {
    const { isOpen, popoverPos } = this.state;

    if (!isOpen) {
      return;
    }

    const box = this.wrapper.getBoundingClientRect();

    const pos = {
      top: getScrollElement().scrollTop + box.top + box.height - 1,
      left: box.left,
      width: box.width,
    };

    if (
      !popoverPos ||
      popoverPos.top !== pos.top ||
      popoverPos.left !== pos.left ||
      popoverPos.width !== pos.width
    ) {
      this.setState({
        popoverPos: pos,
      });
    }
  };

  repositionLazy = throttle(this.reposition, 50);

  tryOpen() {
    const { isFocus, items } = this.state;

    const newState = {
      isOpen: Boolean(isFocus && items && items.length),
    };

    if (!newState.isOpen) {
      newState.index = null;
      newState.popoverPos = null;
    }

    this.setState(newState);
  }

  load = throttle(
    async value => {
      if (value.length < MIN_SYMBOLS) {
        return;
      }

      try {
        const { suggestNames } = this.props;
        const { isFocus } = this.state;

        const loadId = ++this._loadId;

        const names = await suggestNames(value);

        if (this._loadedId >= loadId) {
          return;
        }

        this._loadedId = loadId;

        this.setState({
          isOpen: isFocus && !isEmpty(names),
          items: names,
          index: 0,
        });

        const { onChange } = this.props;
        const { username } = this.state;

        if (username === value) {
          const account = names.find(item => item.username === username);

          if (account) {
            this.setState(
              {
                userId: account.userId,
              },
              () => {
                onChange(account.userId);
              }
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
    300,
    { leading: false }
  );

  onInputChange = e => {
    const { onChange } = this.props;

    const value = e.target.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '');

    if (value === this.props.value) {
      return;
    }

    this.setState(
      {
        username: value,
        userId: value,
      },
      () => {
        onChange(value);
      }
    );

    if (value.length < MIN_SYMBOLS) {
      this.setState({
        isOpen: false,
        index: null,
        popoverPos: null,
      });
      return;
    }

    this.load(value);
  };

  onFocus = e => {
    const { value } = this.props;

    this.setState(
      {
        isFocus: true,
      },
      () => {
        this.load(value);
      }
    );

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  onBlur = e => {
    if (!this._dontCloseUntil || this._dontCloseUntil < Date.now()) {
      this.setState({
        isFocus: false,
        isOpen: false,
        index: null,
        popoverPos: null,
      });
    }

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  onKeyDown = e => {
    const { onChange } = this.props;
    const { isOpen, items, index } = this.state;

    if (isOpen) {
      switch (e.which) {
        case keyCodes.UP:
        case keyCodes.DOWN:
          e.preventDefault();
          let newIndex;

          if (e.which === keyCodes.UP) {
            if (index === null) {
              newIndex = 0;
            } else {
              newIndex = Math.max(0, index - 1);
            }
          } else if (e.which === keyCodes.DOWN) {
            if (index === null) {
              newIndex = 0;
            } else {
              newIndex = Math.min(Math.min(MAX_VARIANTS, items.length) - 1, index + 1);
            }
          }

          this.setState({
            index: newIndex,
          });
          break;

        case keyCodes.ENTER:
          this.setState({
            isOpen: false,
            index: null,
            popoverPos: null,
          });

          const selected = items[index];

          this.setState(
            {
              userId: selected.userId,
              username: selected.username,
            },
            () => {
              onChange(selected.userId);
            }
          );
          break;

        case keyCodes.ESCAPE:
          e.preventDefault();

          this.setState({
            isOpen: false,
            index: null,
            popoverPos: null,
          });
          break;
      }
    } else {
      this.tryOpen();
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  onItemMouseDown = () => {
    this._dontCloseUntil = Date.now() + 1000;
  };

  onItemClick = ({ userId, username }) => {
    const { onChange } = this.props;

    this.setState({
      isOpen: false,
      index: null,
      popoverPos: null,
    });

    this.setState(
      {
        userId,
        username,
      },
      () => {
        onChange(userId);
      }
    );
  };

  onRef = el => {
    this.wrapper = el;

    if (el) {
      const scrollParent = el.closest('.DialogManager');

      if (scrollParent) {
        if (this.unbindBoxScroll) {
          this.unbindBoxScroll();
        }

        scrollParent.addEventListener('scroll', this.repositionLazy);

        this.unbindBoxScroll = () => {
          this.unbindBoxScroll = null;
          scrollParent.removeEventListener('scroll', this.repositionLazy);
        };
      }
    }
  };

  renderAutocomplete() {
    const { items, index, popoverPos } = this.state;

    return (
      <Autocomplete style={popoverPos}>
        {items.slice(0, MAX_VARIANTS).map(({ userId, username }, i) => (
          <Item
            key={userId}
            selected={i === index}
            onMouseDown={this.onItemMouseDown}
            onClick={() => this.onItemClick({ userId, username })}
          >
            {username}
          </Item>
        ))}
        {items.length > MAX_VARIANTS ? <Dots /> : null}
      </Autocomplete>
    );
  }

  render() {
    const { block } = this.props;
    const { isOpen, isFocus, username, userId, popoverPos } = this.state;

    const isError = (!username || !userId) && !isFocus;

    return (
      <>
        <Wrapper block={block ? 1 : 0} ref={this.onRef}>
          <SimpleInputStyled
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            {...this.props}
            value={username}
            open={isOpen ? 1 : 0}
            error={isError ? 1 : 0}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onInputChange}
            onKeyDown={this.onKeyDown}
          />
          <Sign open={isOpen ? 1 : 0} error={isError ? 1 : 0} />
          {isOpen && popoverPos ? createPortal(this.renderAutocomplete(), this._mount) : null}
        </Wrapper>
        <AccountId>Id: {userId}</AccountId>
      </>
    );
  }
}
