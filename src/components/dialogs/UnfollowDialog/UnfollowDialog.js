import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { Link } from 'shared/routes';

import DialogFrame from 'components/dialogs/DialogFrame';

const CONFIRMED_ID = 'CONFIRMED';

const BodyWrapper = styled.div`
  text-align: center;
  color: #959595;
`;

const UserLink = styled.a`
  color: #393636;

  &:hover,
  &:focus {
    color: #2879ff;
  }
`;

export default class UnfollowDialog extends Component {
  static propTypes = {
    targetUserId: PropTypes.string.isRequired,
  };

  render() {
    const { targetUserId } = this.props;

    return (
      <DialogFrame
        className="CommonDialog"
        title={tt('g.unfollow')}
        buttons={this.getButtons()}
        username={targetUserId}
        onCloseClick={this.onCloseClick}
      >
        <div className="CommonDialog__body">
          <BodyWrapper>
            {tt('g.confirm_unfollow_user')}
            <Link route="profile" params={{ userId: targetUserId }} passHref>
              <UserLink> @{targetUserId} </UserLink>
            </Link>
            ?
          </BodyWrapper>
        </div>
      </DialogFrame>
    );
  }

  getButtons() {
    return [
      {
        text: tt('g.cancel'),
        onClick: this.onCloseClick,
      },
      {
        text: tt('g.cancel_subscription'),
        primary: true,
        onClick: this.onOkClick,
      },
    ];
  }

  onCloseClick = isActionConfirmed => {
    const { onClose } = this.props;
    onClose(isActionConfirmed === CONFIRMED_ID);
  };

  onOkClick = () => {
    this.onCloseClick(CONFIRMED_ID);
  };
}
