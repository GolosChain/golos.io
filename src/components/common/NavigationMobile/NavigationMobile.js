import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import LinkSelect from 'components/golos-ui/LinkSelect';

const Root = styled.div`
  display: flex;
  height: 48px;
  padding-right: 6px;
  background: #fff;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

export default class NavigationMobile extends PureComponent {
  static propTypes = {
    compact: PropTypes.bool,
    asPath: PropTypes.string.isRequired,
    tabLinks: PropTypes.array.isRequired,
    rightItems: PropTypes.object,
  };

  render() {
    const { asPath, tabLinks, rightItems, className } = this.props;

    return (
      <Root className={className}>
        <LinkSelect asPath={asPath} links={tabLinks} />
        <Filler />
        {rightItems}
      </Root>
    );
  }
}
