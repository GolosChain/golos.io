import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import WelcomeSlider from 'components/welcome/WelcomeSlider';

const Root = styled.section`
  padding: 30px 0;
  background-color: #3f46ad;
`;

const Row = styled.div`
  min-height: 597px;
`;

const Header = styled.div`
  font-family: ${({ theme }) => theme.fontFamilySerif};
  font-size: 33px;
  font-weight: bold;
  line-height: 1.33;
  color: #fff;
  margin: 0 0 40px 63px;
`;

export default class Reviews extends PureComponent {
  render() {
    const { slides } = this.props;

    return (
      <Root>
        <Row className="row align-middle">
          <div className="columns small-12 medium-4 large-6">
            <img src="images/new/welcome/welcome__reviews.svg" />
          </div>
          <div className="columns small-12 medium-8 large-6">
            <Header>{tt('welcome_page.reviews')}</Header>
            <WelcomeSlider slides={slides} />
          </div>
        </Row>
      </Root>
    );
  }
}
