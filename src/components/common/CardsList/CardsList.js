import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';

import { getScrollElement } from 'helpers/window';
import { isFetchingOrRecentlyUpdated } from 'utils/StateFunctions';

import PostCard from 'components/cards/PostCard';
import PostCardCompact from 'components/cards/PostCardCompact';
import LoadingIndicator from 'components/elements/LoadingIndicator';

export const FORCE_LINES_WIDTH = 1000;
const FORCE_COMPACT_WIDTH = 550;

const Root = styled.div``;

const ColumnsContainer = styled.div`
  display: flex;
`;

const Column = styled.div`
  flex: 1 1 100px;
  min-width: 100px;

  &:first-child {
    margin-right: 16px;
  }
`;

const Loader = styled.div`
  margin-bottom: 20px;
`;

export default class CardsList extends PureComponent {
  static propTypes = {
    // external
    userId: PropTypes.string,
    category: PropTypes.string,
    items: PropTypes.array,
    layout: PropTypes.oneOf(['list', 'grid', 'compact']),
    itemRender: PropTypes.func,
    allowInlineReply: PropTypes.bool,
    showPinButton: PropTypes.bool,
    disallowGrid: PropTypes.bool,
    hideIgnored: PropTypes.bool,
    ignoreResult: PropTypes.any,
    listScrollPosition: PropTypes.number,
  };

  static defaultProps = {
    items: [],
    layout: 'list',
    allowInlineReply: false,
    showPinButton: false,
    hideIgnored: false,
  };

  state = {
    forceLines: false,
    forceCompact: false,
  };

  rootRef = React.createRef();

  componentDidMount() {
    window.addEventListener('scroll', this.onScrollLazy);
    window.addEventListener('resize', this.onResizeLazy);

    const { location, backClickTs, listScrollPosition } = this.props;

    // if (location.get('action') === 'POP' || (backClickTs && backClickTs > Date.now() - 5000)) {
    //   getScrollElement().scrollTop = listScrollPosition;
    //
    //   let setScrollIterations = 0;
    //
    //   this._scrollIntervalId = setInterval(() => {
    //     getScrollElement().scrollTop = listScrollPosition;
    //
    //     if (++setScrollIterations === 10) {
    //       clearInterval(this._scrollIntervalId);
    //     }
    //   }, 50);
    // }

    const width = window.innerWidth;

    if (width < FORCE_LINES_WIDTH) {
      this.setState({
        forceLines: width < FORCE_LINES_WIDTH,
        forceCompact: width < FORCE_COMPACT_WIDTH,
      });
    }
  }

  componentWillUnmount() {
    if (this._scrollIntervalId) {
      clearInterval(this._scrollIntervalId);
    }
    window.removeEventListener('scroll', this.onScrollLazy);
    window.removeEventListener('resize', this.onResizeLazy);
    this.onResizeLazy.cancel();
    this.onScrollLazy.cancel();
  }

  onScrollLazy = throttle(
    () => {
      const rect = this.rootRef.current ? this.rootRef.current.getBoundingClientRect() : null;

      if (rect && rect.top + rect.height < window.innerHeight * 1.5) {
        this.loadMore();
      }
    },
    100,
    { leading: false, trailing: true }
  );

  onResizeLazy = throttle(() => {
    const width = window.innerWidth;

    this.setState({
      forceLines: width < FORCE_LINES_WIDTH,
      forceCompact: width < FORCE_COMPACT_WIDTH,
    });
  }, 100);

  loadMore = () => {
    const { isLoading, loadMore } = this.props;

    if (isLoading) {
      return;
    }

    if (!loadMore) {
      return;
    }

    loadMore();
  };

  onEntryClick = () => {
    this.props.saveListScrollPosition(getScrollElement().scrollTop);
  };

  renderLoaderIfNeed() {
    const { isLoading } = this.props;

    if (isLoading) {
      return (
        <Loader>
          <LoadingIndicator type="circle" center size={40} />
        </Loader>
      );
    }
  }

  checkIsIgnored = data => {
    const { ignoreResult, hideIgnored } = this.props;

    if (!hideIgnored) {
      return false;
    }

    const author = data.split('/')[0];

    return ignoreResult && ignoreResult.has(author);
  };

  itemRender = props => {
    const { layout } = this.props;

    if (layout === 'compact') {
      return <PostCardCompact {...props} />;
    }
    return <PostCard {...props} />;
  };

  renderCards() {
    const { items, layout, disallowGrid } = this.props;
    const { forceLines } = this.state;

    const isGrid = !disallowGrid && !forceLines && layout === 'grid';

    if (isGrid) {
      const columns = [[], []];

      for (let i = 0; i < items.length; i++) {
        columns[i % 2 === 0 ? 0 : 1].push(items[i]);
      }

      return (
        <ColumnsContainer>
          {columns.map((column, i) => (
            <Column key={i}>{column.map(this.renderCard)}</Column>
          ))}
        </ColumnsContainer>
      );
    }
    return items.map(this.renderCard);
  }

  renderCard = id => {
    const {
      userId,
      layout,
      allowInlineReply,
      showPinButton,
      disallowGrid,
      itemRender,
    } = this.props;

    const { forceCompact, forceLines } = this.state;

    const itemRenderFunc = itemRender || this.itemRender;
    const compact = (!disallowGrid && !forceLines && layout === 'grid') || forceCompact;

    if (this.checkIsIgnored(id)) {
      return null;
    }

    return itemRenderFunc({
      key: id,
      id,
      compact,
      allowInlineReply,
      userId,
      showPinButton,
      onClick: this.onEntryClick,
    });
  };

  render() {
    return (
      <Root ref={this.rootRef}>
        {this.renderCards()}
        {this.renderLoaderIfNeed()}
      </Root>
    );
  }
}
