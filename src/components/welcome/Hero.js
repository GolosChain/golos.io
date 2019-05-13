import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

const Root = styled.section`
  display: flex;
  padding: 20px 0;
  align-items: center;
  min-height: 550px;
  background-color: #3f46ad;
  color: #fff;
`;

const Row = styled.div`
  min-height: 550px;

  @media screen and (max-width: 39.9375em) {
    min-height: 450px;
  }
`;

const Greeting = styled.div`
  font-family: ${({ theme }) => theme.fontFamilySerif};
  font-size: 65px;
  line-height: 1.3;
  text-align: left;

  @media screen and (max-width: 39.9375em) {
    font-size: 25px;
  }
`;

const Congratulations = styled.div`
  font-size: 22px;
  line-height: 1;
  text-align: left;
  margin-top: 20px;

  @media screen and (max-width: 39.9375em) {
    font-size: 16px;
    margin-top: 10px;
  }
`;

export default class Hero extends PureComponent {
  render() {
    return (
      <Root>
        <Row className="row align-middle">
          <div className="column small-12 medium-7">
            <Greeting>
              {tt('welcome_page.greeting_1')}
              <br />
              {tt('welcome_page.greeting_2')}
            </Greeting>
            <Congratulations>{tt('welcome_page.congratulations')}</Congratulations>
          </div>
          <div className="column small-12 medium-5">
            <img src="images/new/welcome/welcome__hero.svg" />
          </div>
        </Row>
      </Root>
    );
  }
}
