import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'components/golos-ui/Button';
// import { blockedUsersContent, blockedContent } from 'utils/IllegalContent';
import NotFoundFragment from 'components/elements/NotFoundFragment';
// import BlockedContent from 'components/elements/BlockedContent';
// import LoadingIndicator from 'components/elements/LoadingIndicator';
import PostContent from 'containers/post/PostContent';
import ActivePanel from 'containers/post/ActivePanel';
import AboutPanel from 'containers/post/AboutPanel';
import SidePanel from 'containers/post/SidePanel';
import RegistrationPanel from 'components/post/RegistrationPanel';
import CommentsContainer from 'containers/post/CommentsContainer';

import { setScrollRestoration } from 'utils/ui';

export const POST_MAX_WIDTH = 840;
const POST_MARGINS_MOBILE = 20;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${POST_MAX_WIDTH}px;
  padding-top: 22px;
  padding-bottom: 17px;
  margin: 0 auto;

  @media (max-width: ${POST_MAX_WIDTH + POST_MARGINS_MOBILE * 2}px) {
    margin: 0 ${POST_MARGINS_MOBILE}px;
  }

  @media (max-width: 576px) {
    padding-top: 8px;
    margin: 0;
  }
`;

const SpamBlock = styled.div`
  display: flex;
  height: 140px;
  padding: 30px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const SpamText = styled.div`
  margin-right: 10px;
`;

const PostContentWrapper = styled.div``;

export default class Post extends Component {
  state = {
    showAlert: this.isNeedShowAlert(this.props),
  };

  postContentRef = createRef();

  componentDidMount() {
    const { post, recordPostView } = this.props;

    // eslint-disable-next-line no-console
    recordPostView(post.contentId).catch(err => console.warn(err));
    const { isCommentsLoading } = this.props;
    if (!isCommentsLoading && window.location.hash) {
      setScrollRestoration('manual');
      setTimeout(() => {
        const selectorString = decodeURIComponent(window.location.hash).replace('#', '');
        const comment = document.querySelector(`#${CSS.escape(selectorString)}`);
        if (comment) {
          const scrollToPosition = comment.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth',
          });
        }
      }, 300);
    }
  }

  componentWillReceiveProps(props) {
    if (!this.props.state && props.state) {
      this.setState({
        showAlert: this.isNeedShowAlert(props),
      });
    }
  }

  componentWillUnmount() {
    setScrollRestoration('auto');
  }

  isNeedShowAlert(props) {
    if (props.isLowReputation) {
      return true;
    }

    if (props.post.stats) {
      return props.post.stats.gray || props.post.stats.hide;
    }

    return false;
  }

  onShowClick = () => {
    this.setState({
      showAlert: false,
    });
  };

  render() {
    const { user, isOwner, isAuthorized, post, isHidden, author, permLink } = this.props;
    const { showAlert } = this.state;

    if (isHidden) {
      return <NotFoundFragment />;
    }

    // if (blockedUsersContent.includes(author) || blockedContent.includes(`${author}/${permLink}`)) {
    //   return <BlockedContent reason={tt('g.blocked_user_content')} />;
    // }

    if (showAlert) {
      return (
        <Wrapper>
          <SpamBlock>
            <SpamText>{tt('post.hidden')}</SpamText>
            <Button light onClick={this.onShowClick}>
              {tt('g.show')}
            </Button>
          </SpamBlock>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <ContentWrapper>
          <PostContentWrapper ref={this.postContentRef}>
            <PostContent post={post} />
          </PostContentWrapper>
          <ActivePanel post={post} />
          {isOwner ? null : <AboutPanel post={post} />}
          <SidePanel post={post} postContentRef={this.postContentRef} />
          {isAuthorized ? null : <RegistrationPanel />}
          <CommentsContainer user={user} post={post} />
        </ContentWrapper>
      </Wrapper>
    );
  }
}
