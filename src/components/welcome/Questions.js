import React, { PureComponent } from 'react';
import { Link } from 'mocks/react-router';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/elements/Icon';
import CardPost from 'components/welcome/CardPost';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import { WIKI_URL } from 'constants/config';
import { logOutboundLinkClickAnalytics } from 'helpers/gaLogs';

const Root = styled.section`
  padding: 20px 0;
  background: #f8f8f8;
`;

const CardPost_W = styled.div`
  @media screen and (max-width: 74.9375em) {
    margin-bottom: 10px;
  }
`;

const Row = styled.div`
  min-height: 600px;
`;

const Header = styled.div`
  margin-bottom: 10px;
  line-height: 1.06;
  font-size: 36px;
  letter-spacing: 0.6px;
  font-family: ${({ theme }) => theme.fontFamilySerif};
  color: #333;
`;

const SubHeader = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: 20px;
  line-height: 1.5;
  color: #9fa3a7;
  margin-bottom: 48px;
`;

const NormalLink = styled.a`
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.4px;
  color: #333;
  margin-bottom: 15px;
  border-radius: 8.5px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  text-transform: uppercase;
  line-height: 1.2;
  padding: 25px 5px 25px 20px;
  align-items: center;
  display: flex;
  min-height: 92px;

  @media screen and (max-width: 39.9375em) {
    min-height: unset;
  }

  .Icon {
    margin-right: 15px;
    fill: #ffc80a;
  }

  &:hover {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
`;

const LinkStyled = NormalLink.withComponent(Link);

export default class Questions extends PureComponent {
  logEventAnalytics = () => {
    logOutboundLinkClickAnalytics(`https:${tt('link_to.telegram')}`);
  };

  render() {
    const { questionsLoading, questionsCards } = this.props;
    return (
      <Root>
        <Row className="row align-middle">
          <div className="columns">
            <Header>{tt('welcome_page.questions_header')}</Header>
            <SubHeader>{tt('welcome_page.questions_subheader')}</SubHeader>
            <div className="row">
              <div className="columns small-12 medium-12 large-2">
                <div className="row small-up-1 medium-up-2 large-up-1">
                  <div className="columns">
                    <LinkStyled to="/faq">
                      <Icon name="new/monitor" size="2x" />
                      {tt('welcome_page.link.monitor')}
                    </LinkStyled>
                  </div>
                  <div className="columns">
                    <NormalLink
                      href={`https:${tt('link_to.telegram')}`}
                      target="_blank"
                      rel="noopener norefferer"
                      onClick={this.logEventAnalytics}
                    >
                      <Icon name="new/telegram" size="2x" />
                      {tt('welcome_page.link.telegram')}
                    </NormalLink>
                  </div>
                  <div className="columns">
                    <NormalLink href={WIKI_URL} target="_blank" rel="noopener noreferrer">
                      <Icon name="new/wikipedia" size="2x" />
                      {tt('welcome_page.link.wikipedia')}
                    </NormalLink>
                  </div>
                  <div className="columns">
                    <NormalLink
                      href="mailto:support@golos.io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="new/envelope" size="2x" />
                      {tt('welcome_page.link.envelope')}
                    </NormalLink>
                  </div>
                </div>
              </div>
              {questionsLoading ? (
                <div className="columns align-self-middle">
                  <center>
                    <LoadingIndicator type="circle" size={90} />
                  </center>
                </div>
              ) : (
                <div className="columns">
                  <div className="row small-up-1 large-up-2">
                    {questionsCards.map(post => (
                      <div className="columns" key={post.id}>
                        <CardPost className={CardPost_W} post={post} />
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
