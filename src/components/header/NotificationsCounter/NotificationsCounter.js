import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import IconBadge from 'components/golos-ui/IconBadge';
import IconWrapper from '../IconWrapper';

const Wrapper = styled(IconWrapper)`
  color: #393636;

  &:hover {
    color: #2879ff;
  }

  ${is('active')`
    color: #2879ff;
  `};

  ${is('mobile')`
    margin-left: 0;
  `};
`;

const Button = styled.button.attrs({ type: 'button' })``;

export default class NotificationsCounter extends PureComponent {
  static propTypes = {
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isOpen: PropTypes.bool.isRequired,
    iconRef: PropTypes.shape({}),

    onToggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    count: 0,
    iconRef: {},
  };

  onClick = e => {
    const { onToggle } = this.props;

    e.preventDefault();

    onToggle();
  };

  render() {
    const { count, isOpen, iconRef } = this.props;

    return (
      <Button
        name="header__notifications"
        aria-label={tt('aria_label.notifications', { count })}
        onClick={this.onClick}
      >
        <Wrapper active={isOpen ? 1 : 0} ref={iconRef}>
          <IconBadge name="bell" size={20} count={count} />
        </Wrapper>
      </Button>
    );
  }
}
