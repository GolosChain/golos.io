/* eslint-disable react/no-array-index-key */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import tt from 'counterpart';

import { TagLink } from 'components/golos-ui/Tag';

import { breakWordStyles } from 'helpers/styles';
import PostHeader from 'containers/post/PostHeader';
import MarkdownViewer from 'components/cards/MarkdownViewer/MarkdownViewer';
import PostFormLoader from 'components/modules/PostForm/loader';
import ViewCount from 'components/common/ViewCount';
// import CurationPercent from 'components/common/CurationPercent';

import { Router } from 'shared/routes';
import extractContent from 'utils/bodyProcessing/extractContent';

const Wrapper = styled.article`
  position: relative;
  padding: 40px 0 60px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 576px) {
    padding: 20px 0;
    border-radius: 0;
  }
`;

const Preview = styled.div`
  padding: 0 70px;

  @media (max-width: 576px) {
    padding: 0 20px;
  }
`;

const Body = styled.div`
  margin-top: 5px;
`;

const Footer = styled.div`
  display: flex;
  margin-top: 20px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const FooterInfoBlock = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  & > :last-child {
    margin-left: 24px;
  }

  @media (max-width: 500px) {
    justify-content: flex-end;
    margin-top: 10px;
  }
`;

const PostTitle = styled.h1`
  color: #343434;
  font-weight: 500;
  font-size: 2rem;
  line-height: 40px;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased;
  ${breakWordStyles};

  @media (max-width: 576px) {
    font-size: 30px;
  }
`;

const PostBody = styled.div`
  padding-top: 12px;

  p,
  li {
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.56;
    color: #333;
  }

  @media (max-width: 576px) {
    font-size: 1rem;
    letter-spacing: -0.26px;
    line-height: 24px;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
`;

const TagLinkStyled = styled(TagLink)`
  height: 26px;
  margin: 5px 10px 5px 0;
`;

export default class PostContent extends Component {
  static propTypes = {
    post: PropTypes.shape({}).isRequired,
    router: PropTypes.shape({}).isRequired,
    isAuthor: PropTypes.bool,
  };

  static defaultProps = {
    isAuthor: false,
  };

  state = {
    hideTagsCategory: false,
  };

  headerRef = createRef();

  componentDidMount() {
    const { router } = this.props;

    if (router.query.mode !== 'edit') {
      window.addEventListener('scroll', this.onScrollLazy);
      window.addEventListener('resize', this.onScrollLazy);
      this.onScrollLazy();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollLazy);
    window.removeEventListener('resize', this.onScrollLazy);
    this.onScrollLazy.cancel();
  }

  onScrollLazy = throttle(
    () => {
      const rect = this.headerRef.current.getBoundingClientRect();

      const hideTagsCategory = rect.top - rect.height / 2 >= 0;

      // eslint-disable-next-line react/destructuring-assignment
      if (this.state.hideTagsCategory !== hideTagsCategory) {
        this.setState({ hideTagsCategory });
      }
    },
    100,
    { leading: false, trailing: true }
  );

  onEditFinish = () => {
    const { router } = this.props;
    const params = {
      ...router.query,
    };

    if (params.mode) {
      delete params.mode;
    }

    Router.pushRoute('post', params);
  };

  renderHelmet() {
    const { post } = this.props;

    const content = extractContent(post.content.body, 100);

    return (
      <Head>
        <title>{tt('meta.title.common.post', { title: post.content.title })}</title>
        <meta property="og:title" key="og:title" content={post.content.title} />
        {content.desc ? (
          <>
            <meta name="description" content={content.desc} />
            <meta property="og:description" key="og:description" content={content.desc} />
          </>
        ) : null}
        {content.image ? <meta property="og:image" key="og:image" content={content.image} /> : null}
      </Head>
    );
  }

  renderPreview() {
    const { post } = this.props;
    const { hideTagsCategory } = this.state;

    const tags = post.content?.metadata?.tags || [];

    return (
      <Preview>
        <Body>
          <PostTitle>{post.content.title}</PostTitle>
          <PostBody>
            <MarkdownViewer
              text={post.content.body.raw}
              large
              highQualityPost={false}
              // noImage={!post.pictures}
            />
          </PostBody>
        </Body>
        <Footer>
          {tags.length ? (
            <Tags>
              {tags.map((tag, index) => {
                if (hideTagsCategory && tag === tags[0]) {
                  return null;
                }

                return (
                  <TagLinkStyled
                    route={`/created?tags=${tag}`}
                    key={index}
                    aria-label={tt('aria_label.tag', { tag })}
                    category={tag === tags[0]}
                  >
                    {tag}
                  </TagLinkStyled>
                );
              })}
            </Tags>
          ) : null}
          <FooterInfoBlock>
            {/* <CurationPercent postLink={postLink} /> */}
            <ViewCount contentUrl={post.id} />
          </FooterInfoBlock>
        </Footer>
      </Preview>
    );
  }

  renderEditor() {
    const { post } = this.props;

    return (
      <PostFormLoader
        post={post}
        editMode
        onSuccess={this.onEditFinish}
        onCancel={this.onEditFinish}
      />
    );
  }

  render() {
    const { className, isAuthor, router, post } = this.props;
    const isEdit = router.query.mode === 'edit';

    if (!post) {
      return null;
    }

    return (
      <Wrapper className={className}>
        {this.renderHelmet()}
        <PostHeader post={post} forwardRef={this.headerRef} isEdit={isEdit} />
        {isEdit && isAuthor ? this.renderEditor() : this.renderPreview()}
      </Wrapper>
    );
  }
}
