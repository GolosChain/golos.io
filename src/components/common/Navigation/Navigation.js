import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TabLink } from 'components/golos-ui/Tab';
import SlideContainer from 'components/common/SlideContainer';
import {
  CONTAINER_MAX_WIDTH,
  CONTAINER_FULL_WIDTH,
  CONTAINER_BASE_MARGIN,
  CONTAINER_MOBILE_WIDTH,
  CONTAINER_MOBILE_MARGIN,
} from 'constants/container';

const SlideContainerStyled = styled(SlideContainer)`
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Container = styled.div`
  flex: 1 0;
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0 auto;

  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    margin: 0;
    padding: 0 ${CONTAINER_BASE_MARGIN}px;
  }

  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    padding: 0 ${CONTAINER_MOBILE_MARGIN}px;
  }
`;

const Wrapper = styled.nav`
  display: flex;
  flex: 1 0;
`;

const TabLinkStyled = styled(TabLink).attrs({
  isLink: true,
  activeClassName: 'active',
})`
  height: 50px;
  padding: 0 ${({ compact }) => (compact ? '6px' : '12px')};
  text-align: center;

  &:first-child {
    margin-left: 0;
  }

  &.${({ activeClassName }) => activeClassName}:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #333;
  }

  @media (max-width: 665px) {
    &.${({ activeClassName }) => activeClassName}:after {
      display: none;
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

export default class Navigation extends PureComponent {
  static propTypes = {
    compact: PropTypes.bool,
    tabLinks: PropTypes.array.isRequired,
    rightItems: PropTypes.object,
  };

  render() {
    const { tabLinks, rightItems, compact, className } = this.props;

    return (
      <SlideContainerStyled className={className}>
        <Container>
          <Wrapper>
            {tabLinks.map(({ text, route, params, includeRoute, includeSubRoutes }) => (
              <TabLinkStyled
                key={text}
                route={route}
                params={params}
                compact={compact ? 1 : 0}
                includeRoute={includeRoute}
                includeSubRoutes={includeSubRoutes}
              >
                {text}
              </TabLinkStyled>
            ))}
            {rightItems ? <Right>{rightItems}</Right> : null}
          </Wrapper>
        </Container>
      </SlideContainerStyled>
    );
  }
}
