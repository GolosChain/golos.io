/* eslint-disable no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import Routes, { Link } from 'shared/routes';

import { APP_NAME } from 'constants/config';
import { fetchPosts, fetchProfile } from 'store/actions/gate';
import { entitySelector } from 'store/selectors/common';

import CardsList from 'components/common/CardsList';
import NoPostsPlaceholder from 'components/home/NoPostsPlaceholder';
import TagsBox from 'components/home/TagsBox/TagsBox';

const Wrapper = styled.div`
  background-color: #f9f9f9;
`;

const Callout = styled.div`
  padding: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 3px;
  background-color: #fff;
`;

export default class HomeContent extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
    selectedTags: PropTypes.arrayOf(PropTypes.string),
    layout: PropTypes.oneOf(['list', 'grid', 'compact']).isRequired,
    fetchError: PropTypes.bool,
    type: PropTypes.string,
    feedType: PropTypes.string,
    isEnd: PropTypes.bool,
    tagsStr: PropTypes.string,
    sequenceKey: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
    loggedUserId: PropTypes.string,
    fetchPosts: PropTypes.func.isRequired,
  };

  static defaultProps = {
    posts: [],
    isFetching: false,
    fetchError: false,
    selectedTags: [],
    type: 'community',
    feedType: '',
    isEnd: false,
    tagsStr: null,
    sequenceKey: '',
    username: null,
    loggedUserId: null,
  };

  static async getInitialProps({ store, asPath, query: { tags, userId, username } }) {
    const feedType = Routes.findAndGetUrls(asPath).route.name;
    const type = userId || username ? 'subscriptions' : 'community';
    const selectedTags = tags ? tags.split(',') : [];

    const fetchPostsData = {
      type,
      feedType,
      tags: selectedTags,
    };

    fetchPostsData.userId = userId;
    fetchPostsData.username = username;

    try {
      await store.dispatch(fetchPosts(fetchPostsData));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }

    if (userId) {
      let state = store.getState();

      username =
        entitySelector('profiles', userId)(state)?.username ||
        entitySelector('users', userId)(state)?.username;

      if (!username) {
        try {
          await store.dispatch(fetchProfile({ userId }));
          state = store.getState();
          username =
            entitySelector('profiles', userId)(state)?.username ||
            entitySelector('users', userId)(state)?.username;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(err);
        }
      }
    }

    return {
      tagsStr: tags,
      type,
      feedType,
      selectedTags,
      userId,
      username,
    };
  }

  async componentDidMount() {
    const { fetchError, fetchPosts, type, feedType, selectedTags, userId, username } = this.props;

    if (fetchError) {
      try {
        const params = {
          type,
          feedType,
          tags: selectedTags,
        };

        if (userId) {
          params.userId = userId;
        }

        if (username) {
          params.username = username;
        }

        await fetchPosts(params);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    }
  }

  fetchPosts = () => {
    const {
      isFetching,
      isEnd,
      feedType,
      type,
      selectedTags,
      sequenceKey,
      fetchPosts,
      userId,
      username,
    } = this.props;

    if (!isFetching && !isEnd) {
      const params = {
        type,
        feedType,
        tags: selectedTags,
        sequenceKey,
      };

      if (userId) {
        params.userId = userId;
      }

      if (username) {
        params.username = username;
      }

      fetchPosts(params);
    }
  };

  renderCallout() {
    const { loggedUserId, feedType, tagsStr, userId, username } = this.props;

    if (feedType !== 'feed') {
      return <NoPostsPlaceholder feedType={feedType} tagsStr={tagsStr} userId={userId} />;
    }

    const isMyAccount = loggedUserId === userId;

    return (
      <div>
        {tt('user_profile.user_hasnt_followed_anything_yet', {
          name: username,
        })}
        {isMyAccount ? (
          <>
            <br />
            <br />
            {tt('user_profile.if_you_recently_added_new_users_to_follow')}
            <br />
            <br />
            <Link to="/trending">{tt('user_profile.explore_APP_NAME', { APP_NAME })}</Link>
            <br />
            <a href="https://golos.io/ru--golos/@bitcoinfo/samyi-polnyi-f-a-q-o-golose-spisok-luchshykh-postov-raskryvayushikh-vse-aspekty-proekta-bonusy-v-vide-kreativa">
              {tt('user_profile.full_faq', { APP_NAME })}
            </a>
          </>
        ) : null}
      </div>
    );
  }

  render() {
    const { isFetching, posts, feedType, layout, selectedTags, userId } = this.props;

    let pageUserId = null;

    if (userId && feedType === 'feed') {
      pageUserId = userId;
    }

    return (
      <Wrapper>
        <TagsBox selectedTags={selectedTags} />
        {!isFetching && posts && !posts.length ? <Callout>{this.renderCallout()}</Callout> : null}
        <CardsList
          userId={pageUserId}
          items={posts}
          category={feedType}
          isLoading={isFetching}
          hideIgnored
          layout={layout}
          loadMore={this.fetchPosts}
        />
      </Wrapper>
    );
  }
}
