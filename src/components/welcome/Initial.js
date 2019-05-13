import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import CardPost from 'components/welcome/CardPost';

const Root = styled.section`
  padding: 20px 0;
  background-color: #f8f8f8;
`;

const CardPostStyled = styled(CardPost)`
  @media (max-width: 74.9375em) {
    margin-bottom: 10px;
  }
`;

const Row = styled.div`
  min-height: 600px;
`;

const Header = styled.div`
  margin-bottom: 40px;
  line-height: 1.06;
  letter-spacing: 0.6px;
  font-size: 36px;
  font-family: ${({ theme }) => theme.fontFamilySerif};
  color: #333;
`;

const SubHeader = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1.4px;
  color: #333;
  text-transform: uppercase;
  margin-bottom: 30px;
`;

const Tags = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;

  @media screen and (max-width: 39.9375em) {
    flex-direction: row;
  }
`;

const Tag = styled.div`
  padding: 9px 17px;
  margin-bottom: 15px;
  margin-right: 10px;
  border-radius: 6px;
  background-color: #eeefff;
  border: 1px solid #848ade;
  font-size: 15px;
  line-height: 1;
  color: #3f46ad;
  cursor: pointer;
  transition: background-color 0.5s;

  &:hover,
  &.active {
    background-color: #fff;
  }
`;

export default class Initial extends PureComponent {
  render() {
    const { tags, tagsActiveId, tagsLoading, tagsCards, className, fetchTagContents } = this.props;

    return (
      <Root className={className}>
        <Row className="row align-middle">
          <div className="columns">
            <Header>{tt('welcome_page.initial_header')}</Header>
            <div className="row">
              <div className="columns small-12 medium-3 large-2">
                <SubHeader>{tt('welcome_page.initial_subheader')}</SubHeader>
                <Tags>
                  {tags.map(tag => (
                    <Tag
                      key={tag.id}
                      className={tag.id === tagsActiveId ? 'active' : ''}
                      onClick={() => fetchTagContents(tag)}
                    >
                      {tag.name}
                    </Tag>
                  ))}
                </Tags>
              </div>
              {tagsLoading ? (
                <div className="columns align-self-middle">
                  <center>
                    <LoadingIndicator type="circle" size={90} />
                  </center>
                </div>
              ) : (
                <div className="columns">
                  <div className="row small-up-1 large-up-2">
                    {tagsCards[tagsActiveId] &&
                      tagsCards[tagsActiveId].map(post => (
                        <div className="columns" key={post.id}>
                          <CardPostStyled post={post} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Row>
      </Root>
    );
  }
}
