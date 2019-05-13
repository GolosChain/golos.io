import React from 'react';
import PropTypes from 'prop-types';
import links from 'utils/Links';
import { browserHistory } from 'mocks/react-router';

export default class Link extends React.Component {
  static propTypes = {
    // HTML properties
    href: PropTypes.string,
    title: PropTypes.string,
  };

  constructor(props) {
    super();
    const { href } = props;
    this.localLink = href && links.local.test(href);
    this.onLocalClick = e => {
      e.preventDefault();
      browserHistory.push(this.props.href);
    };
  }

  render() {
    const {
      props: { href, children, title },
      onLocalClick,
    } = this;
    if (this.localLink) return <a onClick={onLocalClick}>{children}</a>;
    return (
      <a target="_blank" href={href} title={title}>
        {children}
      </a>
    );
  }
}
