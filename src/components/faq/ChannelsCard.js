import React, { Component } from 'react';
import { Link } from 'mocks/react-router';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';
import { logOutboundLinkClickAnalytics } from 'helpers/gaLogs';

const LinkTo = ({ children, link, ariaLabel, onClick, className }) => (
  <Link
    to={link}
    target={link.startsWith('/') ? null : '_blank'}
    aria-label={ariaLabel}
    onClick={onClick}
    className={className}
  >
    {children}
  </Link>
);

const Card = styled(LinkTo)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 214px;
  height: 80px;
  padding: 0 20px;
  border-radius: 8.53px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  color: #ffc80a;
  margin: 10px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    color: #ffc80a;
  }

  @media (max-width: 744px) {
    flex-grow: 1;
    justify-content: center;
  }

  @media (max-width: 510px) {
    display: ${props => (props.showOnMobile ? 'flex' : 'none')};
  }
`;

const Text = styled.p`
  text-transform: uppercase;
  color: #393636;
  margin: 0 0 0 22px;
  font-size: 12px;
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0.37px;
  line-height: 18px;
  font-weight: bold;

  @media (max-width: 744px) {
    width: 150px;
  }
`;

const CustomIcon = styled(Icon)`
  min-width: ${props => props.width}px;
`;

export default class ChannelsCard extends Component {
  static propTypes = {
    channel: PropTypes.shape({
      inscription: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      showOnMobile: PropTypes.bool.isRequired,
    }).isRequired,
  };

  logEventAnalytics = () => {
    const { link } = this.props.channel;
    if (link.startsWith('https:')) {
      logOutboundLinkClickAnalytics(link);
    }
  };

  render() {
    const { inscription, thumbnail, width, height, link, showOnMobile } = this.props.channel;

    return (
      <Card
        link={link}
        showOnMobile={showOnMobile}
        ariaLabel={tt('aria_label.channel_card')}
        onClick={this.logEventAnalytics}
      >
        <CustomIcon name={thumbnail} width={width} height={height} />
        <Text>{inscription}</Text>
      </Card>
    );
  }
}
