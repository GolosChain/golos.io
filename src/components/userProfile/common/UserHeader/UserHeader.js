import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import ReactDropZone from 'react-dropzone';
import { isNil } from 'ramda';
import tt from 'counterpart';

import { ALLOWED_IMAGE_TYPES } from 'constants/config';
import { proxyImage } from 'utils/images';
import { uploadImage, validateImageFile } from 'utils/uploadImages';
import { displayError, displayMessage } from 'utils/toastMessages';
import { repLog10 } from 'utils/ParsersAndFormatters';

import Icon from 'components/golos-ui/Icon';

import { CONTAINER_MAX_WIDTH } from 'constants/container';
import Container from 'components/common/Container';
import Dropdown from 'components/common/Dropdown';
// import DotsButton from 'components/userProfile/common/UserHeader/DotsMenu/DotsButton';
import OnlineStatus from 'components/userProfile/common/OnlineStatus';
import UserProfileAvatar from '../UserProfileAvatar';
import FollowWitnessButtons from './FollowWitnessButtons';
import LoginContainer from './LoginContainer';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 267px;

  &::before {
    position: absolute;
    content: '';
    height: 164px;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.18) 40%,
      rgba(0, 0, 0, 0.61)
    );
  }

  @media (max-width: 768px) {
    &::before {
      height: 50%;
    }
  }

  @media (max-width: 576px) {
    height: 160px;
    min-height: 160px;

    &::before {
      display: none;
    }
  }

  ${({ backgroundUrl }) =>
    backgroundUrl
      ? `
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50%;
        background-image: url(${backgroundUrl});
        `
      : `
        background-size: 41px;
        background-repeat: repeat;
        background-position: 0 -26px;
        background-image: url('/images/profile/pattern.png');

        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          background-image: url('/images/profile/pattern@2x.png');
        }
    `};
`;

const ContainerWrapper = styled(Container)`
  position: relative;
  display: block;
  height: 100%;
  margin: 0 auto;
`;

const ContainerWrapperInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;

  @media (max-width: 768px) {
    padding: 90px 0 20px 0;
  }

  @media (max-width: 576px) {
    display: none;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Name = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-areas: 'name witness dots';

  margin: 15px 0 5px 0;
  font-family: ${({ theme }) => theme.fontFamilySerif};
  font-size: 22px;
  font-weight: bold;
  line-height: 1.6;
  letter-spacing: 0.2px;
  color: #fff;

  @media (max-width: 576px) {
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      'name dots'
      'witness .';

    margin: 0;
    color: #333;
  }
`;

const RealName = styled.span`
  grid-area: name;
  margin: 0;
  white-space: nowrap;
`;

// const WitnessText = styled.span`
//   grid-area: witness;
//   align-self: center;
//   margin-left: 7px;
//   text-transform: capitalize;
//   white-space: nowrap;

//   @media (max-width: 576px) {
//     margin-left: 0;
//     font-size: 16px;
//   }
// `;

const AvatarDropZone = styled.div`
  position: absolute !important;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: none !important;
  outline: none !important;
  cursor: pointer;
  background: rgba(248, 248, 248, 0.8);
  opacity: 0.5;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`;

const DropZoneItemWrapper = styled.div`
  position: relative;
  outline: none;
`;

function DropZoneItem({ children, disabled, onDrop }) {
  return (
    <ReactDropZone
      accept={ALLOWED_IMAGE_TYPES}
      multiple={false}
      disabled={disabled}
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps }) => (
        <DropZoneItemWrapper {...getRootProps()}>
          <input {...getInputProps()} />
          {children}
        </DropZoneItemWrapper>
      )}
    </ReactDropZone>
  );
}

DropZoneItem.propTypes = {
  onDrop: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

DropZoneItem.defaultProps = {
  disabled: false,
};

const DropdownStyled = styled(Dropdown)`
  position: absolute !important;
  top: 24px;

  right: 0;
  cursor: pointer;

  @media (max-width: 768px) {
    right: 24px;
  }
`;

const IconCoverWrapper = styled.div`
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const IconCover = styled(Icon)`
  margin-top: 11px;
  margin-left: 11px;
  width: 20px;
  height: 20px;
`;

const IconPicture = styled(Icon)`
  margin-top: 8px;
  margin-left: 6px;
  color: #333;
`;

const UserProfileAvatarWrapper = styled.div`
  position: relative;

  @media (max-width: 576px) {
    width: 80px;
    height: 80px;
    margin-top: -35px;
  }
`;

const Reputation = styled.div`
  position: absolute;
  right: 7px;
  bottom: 7px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;

  font-size: 11px;
  color: #2879ff;
  pointer-events: none;

  @media (max-width: 576px) {
    right: 2px;
    bottom: 2px;
  }
`;

const MobileUserHeader = styled.div`
  display: none;
  flex-direction: column;
  padding: 16px;
  background-color: #f9f9f9;

  @media (max-width: 576px) {
    display: flex;
  }
`;

const MobileUserInfo = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 410px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MobileButtons = styled.div`
  margin-top: 16px;

  ${is('owner')`
    display: none;
  `};
`;

const MobileNameStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;

  @media (max-width: 410px) {
    align-items: center;
    margin: 10px 0 0 0;
  }
`;

const OnlineStatusStyled = styled(OnlineStatus)`
  position: absolute;
  right: 0;
  bottom: 0;
  margin-bottom: 16px;

  @media (max-width: ${CONTAINER_MAX_WIDTH}px) {
    margin-right: 16px;
  }
`;

const UploadingEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(50, 50, 50, 0.3);
  animation: fade-in 1s infinite alternate ease-in-out;
  pointer-events: none;
  overflow: hidden;
`;

export default class UserHeader extends Component {
  static propTypes = {
    profile: PropTypes.shape({}).isRequired,
    currentUser: PropTypes.shape({}),
    isOwner: PropTypes.bool,
    isSettingsPage: PropTypes.bool,
    power: PropTypes.number,
    witnessInfo: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.instanceOf(Map)]),

    updateProfileMeta: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOwner: false,
    isSettingsPage: false,
    currentUser: null,
    power: 0,
    witnessInfo: null,
  };

  state = {
    isAvatarUploading: false,
    isCoverUploading: false,
  };

  dropdownRef = createRef();

  onRemoveCoverClick = async () => {
    const { updateProfileMeta } = this.props;

    try {
      await updateProfileMeta({
        cover_image: null,
      });
    } catch (err) {
      displayError('Update failed', err);
      return;
    }

    displayMessage('Update done!');
  };

  onAvatarDrop = files => {
    this.uploadDropped(files, 'profile_image', 'isAvatarUploading');
  };

  onDropCover = files => {
    this.uploadDropped(files, 'cover_image', 'isCoverUploading');
    this.dropdownRef.current.close();
  };

  async uploadDropped(files, key, uploadingStateKey) {
    const file = files[0];

    if (!validateImageFile(file)) {
      return;
    }

    this.setState({
      [uploadingStateKey]: true,
    });

    const url = await uploadImage(files[0]);

    const { updateProfileMeta } = this.props;

    try {
      await updateProfileMeta({
        [key]: url,
      });

      displayMessage('Update done!');
    } catch (err) {
      displayError('Update failed', err);
    }

    this.setState({
      [uploadingStateKey]: false,
    });
  }

  renderReputation() {
    const { profile } = this.props;
    const { reputation } = profile.stats;

    if (isNil(reputation)) {
      return null;
    }

    return <Reputation>{repLog10(reputation)}</Reputation>;
  }

  renderAvatar() {
    const { isOwner, isSettingsPage, profile } = this.props;
    const { isAvatarUploading } = this.state;

    return (
      <UserProfileAvatarWrapper>
        {this.renderReputation()}
        <UserProfileAvatar avatarUrl={profile.personal.avatarUrl}>
          {isOwner && isSettingsPage && (
            <ReactDropZone
              accept={ALLOWED_IMAGE_TYPES}
              multiple={false}
              disabled={isAvatarUploading}
              onDrop={this.onAvatarDrop}
            >
              {({ getRootProps, getInputProps }) => (
                <AvatarDropZone {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isAvatarUploading ? (
                    <UploadingEffect />
                  ) : (
                    <IconPicture name="picture" size="28" />
                  )}
                </AvatarDropZone>
              )}
            </ReactDropZone>
          )}
        </UserProfileAvatar>
      </UserProfileAvatarWrapper>
    );
  }

  renderName() {
    const { profile /* currentUser, witnessInfo */ } = this.props;

    // const isWitness = witnessInfo && witnessInfo.get('isWitness');
    // const witnessText = isWitness ? `/ ${tt('g.witness')}` : null;
    const accountUsername = profile.personal?.name || profile.username || profile.userId;
    // const authUsername = currentUser ? currentUser.username : null;

    return (
      <Name>
        <RealName>{accountUsername}</RealName>
        {/* <WitnessText>{witnessText}</WitnessText>
        {authUsername && authUsername !== accountUsername && (
          <DotsButton authUser={authUsername} accountUsername={accountUsername} />
        )} */}
      </Name>
    );
  }

  renderCoverDropDown() {
    const { profile } = this.props;
    const { isCoverUploading } = this.state;

    return (
      <DropdownStyled
        ref={this.dropdownRef}
        items={[
          {
            title: tt('user_profile.select_image'),
            dontCloseOnClick: true,
            Wrapper: DropZoneItem,
            props: {
              disabled: isCoverUploading,
              onDrop: this.onDropCover,
            },
          },
          profile.personal?.coverUrl
            ? {
                title: `${tt('g.remove')}...`,
                onClick: this.onRemoveCoverClick,
              }
            : null,
        ]}
      >
        <IconCoverWrapper data-tooltip={tt('user_profile.change_cover')}>
          <IconCover name="picture" />
        </IconCoverWrapper>
      </DropdownStyled>
    );
  }

  renderButtons() {
    const { profile, isOwner } = this.props;

    if (isOwner) {
      return null;
    }

    return <FollowWitnessButtons targetUser={profile.userId} isOwner={isOwner} />;
  }

  renderLoginContainer() {
    const { profile, power } = this.props;

    return <LoginContainer targetUser={profile} power={power} />;
  }

  render() {
    const { isOwner, isSettingsPage, profile } = this.props;
    const { isCoverUploading } = this.state;
    const { coverUrl } = profile.personal;

    const backgroundUrl = coverUrl ? proxyImage(coverUrl) : null;

    return (
      <>
        <Wrapper backgroundUrl={backgroundUrl}>
          {isCoverUploading ? <UploadingEffect /> : null}
          <ContainerWrapper>
            <ContainerWrapperInner>
              {this.renderAvatar()}
              <Details>
                {this.renderName()}
                {this.renderButtons()}
                {this.renderLoginContainer()}
              </Details>
              {isOwner && isSettingsPage && this.renderCoverDropDown()}
            </ContainerWrapperInner>
            <OnlineStatusStyled username={profile.username} />
          </ContainerWrapper>
        </Wrapper>
        <MobileUserHeader>
          <MobileUserInfo>
            {this.renderAvatar()}
            <MobileNameStatusWrapper>
              {this.renderName()}
              {this.renderLoginContainer()}
            </MobileNameStatusWrapper>
          </MobileUserInfo>
          <MobileButtons owner={isOwner}>{this.renderButtons()}</MobileButtons>
        </MobileUserHeader>
      </>
    );
  }
}
