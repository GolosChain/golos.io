import React, { PureComponent } from 'react';

let CommentForm = null;

export default class CommentFormLoader extends PureComponent {
  componentDidMount() {
    if (!CommentForm) {
      require.ensure('./CommentForm.connect', require => {
        CommentForm = require('./CommentForm.connect').default;

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
    if (CommentForm) {
      return <CommentForm {...this.props} />;
    }

    return <div />;
  }
}
