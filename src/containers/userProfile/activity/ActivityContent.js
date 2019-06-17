import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import Head from 'next/head';
import throttle from 'lodash/throttle';
import ToastsManager from 'toasts-manager';

import { ACTIVITIES_FILTER_TYPES } from 'constants/activities';

import { fetchActivities } from 'store/actions/gate/activities';
import Card from 'components/golos-ui/Card';
import Flex from 'components/golos-ui/Flex';
import Navigation from 'components/common/Navigation';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import ActivityList from 'components/common/ActivityList';
import { visuallyHidden } from 'helpers/styles';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 80px;
`;

const CardContent = styled(Flex)``;

const NavigationStyled = styled(Navigation)`
  padding: 0 14px;
  border-bottom: 1px solid #e9e9e9;
  box-shadow: none;
`;

const Header = styled.h1`
  ${visuallyHidden};
`;

const Empty = styled.div`
  padding: 20px;
`;

const Loader = styled(LoadingIndicator).attrs({
  type: 'circle',
  center: true,
})`
  margin: 20px 0;
`;

const TABS = [
  {
    id: 'all',
    title: 'activity.tab_title.all',
    emptyText: 'activity.tab_title.all_placeholder',
  },
  {
    id: 'awards',
    title: 'activity.tab_title.rewards',
    emptyText: 'activity.tab_title.rewards_placeholder',
  },
  {
    id: 'answers',
    title: 'activity.tab_title.replies',
    emptyText: 'activity.tab_title.replies_placeholder',
  },
  {
    id: 'social',
    title: 'activity.tab_title.social',
    emptyText: 'activity.tab_title.social_placeholder',
  },
  {
    id: 'mentions',
    title: 'activity.tab_title.mention',
    emptyText: 'activity.tab_title.mention_placeholder',
  },
];

export default class ActivityContent extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    subSection: PropTypes.string.isRequired,
    order: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    getNotificationsHistory: PropTypes.func.isRequired,
  };

  static async getInitialProps({ store, query }) {
    const tabId = query.subSection || 'all';

    if (process.browser) {
      try {
        await store.dispatch(
          fetchActivities(
            {
              types: ACTIVITIES_FILTER_TYPES[tabId],
              userId: query.userId,
            },
            {
              tabId,
            }
          )
        );
      } catch (err) {
        console.error(err);
      }
    }

    return {
      userId: query.userId,
      tabId,
    };
  }

  rootRef = createRef();

  componentDidMount() {
    const { isLoading, isEnd, order } = this.props;

    if (!isLoading && !isEnd && order.length === 0) {
      this.fetchActivities();
    }

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.handleScroll.cancel();
  }

  handleScroll = throttle(() => {
    const { isLoading, isEnd } = this.props;

    if (!isLoading && !isEnd) {
      const rect = this.rootRef.current.getBoundingClientRect();
      if (rect.top + rect.height < window.innerHeight * 1.5) {
        this.fetchActivities(true);
      }
    }
  }, 1000);

  fetchActivities = async isLoadMore => {
    const { userId, lastId, tabId, fetchActivities } = this.props;

    try {
      await fetchActivities(
        {
          types: [ACTIVITIES_FILTER_TYPES[tabId]],
          userId: userId,
          fromId: isLoadMore ? lastId : null,
        },
        {
          tabId,
        }
      );
    } catch (err) {
      console.error(err);
      ToastsManager.error('Activities fetching is failed');
    }
  };

  renderTab() {
    const { tabId, tabLoading, order } = this.props;

    if (order.length) {
      return <ActivityList order={order} />;
    }

    if (tabLoading === tabId) {
      return <Loader size={40} />;
    }

    const { emptyText } = TABS.find(tab => tab.id === tabId);

    return <Empty>{tt(emptyText)}</Empty>;
  }

  render() {
    const { userId, isLoading, tabLoading, tabId } = this.props;

    const tabLinks = TABS.map(({ id, title }) => ({
      text: tt(title),
      route: 'profileSection',
      params: {
        userId,
        section: 'activity',
        subSection: id === 'all' ? undefined : id,
      },
    }));

    return (
      <>
        <Head>
          <title>{tt('meta.title.profile.activity', { name: userId })}</title>
        </Head>
        <Header>{tt('g.activity')}</Header>
        <Card auto ref={this.rootRef}>
          <NavigationStyled tabLinks={tabLinks} compact />
          <CardContent column auto>
            {this.renderTab()}
          </CardContent>
        </Card>
        <LoaderWrapper>
          {isLoading && tabLoading !== tabId ? <Loader size={30} /> : null}
        </LoaderWrapper>
      </>
    );
  }
}
