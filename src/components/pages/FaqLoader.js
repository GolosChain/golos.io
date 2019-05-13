import React, { Component } from 'react';

let Faq = null;

export default class FaqLoader extends Component {
  componentDidMount() {
    if (!Faq && process.browser) {
      require.ensure('./Faq', require => {
        Faq = require('./Faq').default;

        if (!this._unmount) {
          this.forceUpdate();
        }
      });
    }
  }

  componentWillUnmount() {
    this._unmount = true;
  }

  render() {
    if (Faq) {
      return <Faq {...this.props} />;
    }

    return <div />;
  }
}
