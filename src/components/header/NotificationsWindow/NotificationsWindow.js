import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import tt from 'counterpart';
import { withRouter } from 'next/router';
import ToastsManager from 'toasts-manager';

import { Link } from 'shared/routes';
import { NOTIFICATIONS_PER_PAGE } from 'constants/notifications';
import { FormFooter, FormFooterButton } from 'components/golos-ui/Form';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import ActivityList from 'components/common/ActivityList';

const LOAD_MORE_VERTICAL_GAP = 300;

const Wrapper = styled.div`
  width: 370px;

  ${is('mobile')`
    width: auto;
    box-shadow: inset 0 0 18px 4px rgba(0, 0, 0, 0.05);
  `};
`;

const WrapperActivity = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const WrapperLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  min-width: 80px;
`;

const StyledDialogFooter = styled(FormFooter)`
  margin: 0;
`;

const EmptyBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-size: 18px;
  color: #aaa;
`;

@withRouter
export default class NotificationsWindow extends PureComponent {
  static propTypes = {
    order: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    markAllViewed: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  state = {
    isInitialLoading: true,
  };

  listWrapper = createRef();

  async componentDidMount() {
    const { router, fetchNotifications, markAllViewed } = this.props;

    router.events.on('routeChangeStart', this.onRouteChange);

    try {
      await fetchNotifications({
        fromId: null,
        limit: NOTIFICATIONS_PER_PAGE,
      });
    } catch (err) {
      console.error(err);
      ToastsManager.error('Notifications fetching is failed');
      return;
    }

    markAllViewed().catch(err => {
      console.error(err);
    });

    this.setState({
      isInitialLoading: false,
    });
  }

  componentWillUnmount() {
    const { router } = this.props;

    router.events.off('routeChangeStart', this.onRouteChange);

    this.onScrollLazy.cancel();
  }

  onRouteChange = () => {
    this.props.onClose();
  };

  markNotificationsAsViewed = () => {
    const { markAllViewed } = this.props;
    markAllViewed();
  };

  checkLoadMore() {
    const { canLoadMore, isFetching, lastId, fetchNotifications } = this.props;

    if (!canLoadMore || isFetching || !lastId) {
      return;
    }

    const list = this.listWrapper.current;

    // Если до конца скролла осталось меньше чем LOAD_MORE_VERTICAL_GAP
    if (list.scrollHeight - list.clientHeight - list.scrollTop < LOAD_MORE_VERTICAL_GAP) {
      const { lastId } = this.props;

      fetchNotifications({
        fromId: lastId,
        limit: NOTIFICATIONS_PER_PAGE,
      });
    }
  }

  onScroll = () => {
    this.checkLoadMore();
  };

  onScrollLazy = throttle(this.onScroll, 200, { leading: false });

  renderFooter() {
    const { username } = this.props;

    const clearTooltip = `<div style="text-align: center">${tt(
      'notifications_menu.clear_notifications_history'
    )}</div>`;

    return (
      <StyledDialogFooter>
        <FormFooterButton
          data-tooltip={clearTooltip}
          data-tooltip-html
          aria-label={tt('notifications_menu.clear_notifications_history')}
          cancel={1}
          onClick={this.markNotificationsAsViewed}
        >
          {tt('dialog.clear')}
        </FormFooterButton>
        <Link route="profileSection" params={{ username, section: 'activity' }} passHref>
          <FormFooterButton aria-label={tt('dialog.show_all')} primary={1}>
            {tt('dialog.show_all')}
          </FormFooterButton>
        </Link>
      </StyledDialogFooter>
    );
  }

  render() {
    const { order, isFetching, isMobile } = this.props;
    const { isInitialLoading } = this.state;

    if (isInitialLoading) {
      return null;
    }

    return (
      <Wrapper mobile={isMobile}>
        <WrapperActivity
          ref={this.listWrapper}
          className="js-scroll-container"
          onScroll={this.onScrollLazy}
        >
          {order.length ? (
            <ActivityList
              order={order}
              isFetching={isFetching}
              isCompact
              checkVisibility
              emptyListPlaceholder={tt('g.empty')}
            />
          ) : (
            <EmptyBlock>{tt('notifications.empty')}</EmptyBlock>
          )}
          {isFetching ? (
            <WrapperLoader>
              <LoadingIndicator type="circle" />
            </WrapperLoader>
          ) : null}
        </WrapperActivity>
        {/*{this.renderFooter()}*/}
      </Wrapper>
    );
  }
}
