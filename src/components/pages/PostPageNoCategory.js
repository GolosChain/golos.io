import React from 'react';
import { browserHistory } from 'mocks/react-router';
import { connect } from 'react-redux';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import NotFoundFragment from 'components/elements/NotFoundFragment';

class PostWrapper extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
    };
  }

  componentWillMount() {
    const route_params = this.props.routeParams;
    const post = `${route_params.username}/${route_params.slug}`;
    const dis = this.props.content.get(post);
    if (!dis) {
      this.props
        .getContent({
          author: route_params.username,
          permlink: route_params.slug,
        })
        .then(content => {
          if (content) {
            browserHistory.replace(`/${content.category}/@${post}`);
          }
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    } else if (dis.get('id') === '0.0.0') {
      // non-existing post
      this.setState({ loading: false });
    } else if (browserHistory) browserHistory.replace(`/${dis.get('category')}/@${post}`);
  }

  shouldComponentUpdate(np, ns) {
    return ns.loading !== this.state.loading;
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <center>
            <LoadingIndicator type="circle" />
          </center>
        ) : (
          <NotFoundFragment />
        )}
      </div>
    );
  }
}

const StoreWrapped = connect(
  state => ({
    content: state.global.get('content'),
  }),
  dispatch => ({
    getContent: payload =>
      new Promise((resolve, reject) => {
        dispatch({
          type: 'GET_CONTENT',
          payload: { ...payload, resolve, reject },
        });
      }),
  })
)(PostWrapper);

export default {
  path: '/@:username/:slug',
  component: StoreWrapped,
};
