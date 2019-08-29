import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { FormattedDate } from 'react-intl';

import { Link } from 'shared/routes';
import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';
import Userpic from 'components/common/Userpic';
// import Follow from 'components/common/Follow';

const Wrapper = styled.div`
  display: flex;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 576px) {
    border-radius: 0;
  }
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const AuthorInfo = styled.div`
  padding: 0 20px 0 10px;
`;

const Account = styled.a`
  display: inline-block;
  padding: 0 10px;
  margin-left: -10px;
  color: #959595;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  line-height: 25px;
`;

const Divider = styled.div`
  width: 1px;
  height: 89px;
  background: #e1e1e1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CakeText = styled.div`
  padding-top: 14px;
`;

const AboutText = styled.div``;

const Cake = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-grow: 2;

  padding: 0 20px;

  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  letter-spacing: -0.26px;
  line-height: 24px;

  ${CakeText}, ${AboutText} {
    color: #959595;
  }

  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  flex-grow: 1;
`;

const ButtonInPanel = styled(Button)`
  min-width: 167px;
  width: 167px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 20px;
  }
`;

const IconStyled = styled(Icon)`
  min-width: 17px;
  min-height: 15px;
  margin-right: 6px;
`;

// const FollowButton = styled(Follow)`
//   min-width: 167px;
//   min-height: 34px;
//
//   @media (max-width: 768px) {
//     width: 100%;
//     margin-top: 20px;
//   }
// `;

export default class AboutPanel extends Component {
  static propTypes = {
    post: PropTypes.shape({}).isRequired,
    profile: PropTypes.shape({}).isRequired,
    currentUserId: PropTypes.string,
    openTransferDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUserId: undefined,
  };

  openDonateDialog = async () => {
    const { post, openTransferDialog } = this.props;

    await openTransferDialog(post.author, 'donate', `/${post.id}`);
  };

  render() {
    const { post, profile, currentUserId } = this.props;
    const { about, author } = post;

    const registrationTime = profile.registration.time;

    if (currentUserId === author) {
      return null;
    }

    const authorId = profile?.username || author;

    return (
      <Wrapper>
        <Avatar>
          <Userpic userId={author} size={50} ariaLabel={tt('aria_label.avatar')} />
          <AuthorInfo>
            <Link route="profile" params={{ userId: authorId }} passHref>
              <Account aria-label={tt('aria_label.username')}>@{authorId}</Account>
            </Link>
          </AuthorInfo>
          <Divider />
        </Avatar>
        <Cake>
          {about ? (
            <AboutText>{about}</AboutText>
          ) : registrationTime ? (
            <>
              <Icon width="36" height="34" name="cake" />
              <CakeText>
                {tt('on_golos_from')}
                &nbsp;
                <FormattedDate value={new Date(registrationTime)} month="long" year="numeric" />
              </CakeText>
            </>
          ) : null}
        </Cake>
        <Buttons>
          <ButtonInPanel light name="author-info__donate" onClick={this.openDonateDialog}>
            <IconStyled width="17" height="15" name="coins_plus" />
            {tt('g.donate')}
          </ButtonInPanel>
          {/*<FollowButton following={account} />*/}
        </Buttons>
      </Wrapper>
    );
  }
}
