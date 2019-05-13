import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Header from '../../components/faq/Header';
import QuestionsList from '../../components/faq/QuestionsList';
import Channels from '../../components/faq/Channels';
import Footer from '../../components/faq/Footer';

const Wrapper = styled.div`
  background-color: #fff;
`;

export default class Faq extends Component {
  constructor() {
    super();
    const locale = tt.getLocale();

    const questionsByLocale = locale => {
      if (locale === 'en') {
        return require('./questions_EN.json');
      }
      if (locale === 'ru') {
        return require('./questions_RU.json');
      }
      if (locale === 'uk') {
        return require('./questions_UA.json');
      }
    };

    const channelsByLocale = locale => {
      if (locale === 'en') {
        return require('./channels_EN.json');
      }
      if (locale === 'ru') {
        return require('./channels_RU.json');
      }
      if (locale === 'uk') {
        return require('./channels_UA.json');
      }
    };

    this.questions = questionsByLocale(locale);
    this.channels = channelsByLocale(locale);
  }

  render() {
    return (
      <Wrapper>
        <Header />
        <QuestionsList questions={this.questions} />
        <Channels channels={this.channels} />
        <Footer />
      </Wrapper>
    );
  }
}
