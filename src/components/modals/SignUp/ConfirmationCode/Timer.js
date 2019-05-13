import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Timer extends Component {
  static propTypes = {
    startingTime: PropTypes.number.isRequired,
    hideTimer: PropTypes.func.isRequired,
  };

  state = {
    seconds: 0,
  };

  componentDidMount() {
    const { startingTime } = this.props;
    this.tickTimer(startingTime);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  tickTimer(seconds) {
    const { hideTimer } = this.props;
    this.setState({ seconds }, () => {
      this.timeoutId = setTimeout(() => this.tickTimer(seconds - 1), 1000);
      if (seconds < 0) {
        clearTimeout(this.timeoutId);
        hideTimer();
      }
    });
  }

  render() {
    const { seconds } = this.state;

    return (
      <span>
        0:{seconds < 10 && 0}
        {seconds}
      </span>
    );
  }
}
