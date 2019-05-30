import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Head from 'next/head';
import { FORM_ERROR } from 'final-form';
import { pick } from 'ramda';
import tt from 'counterpart';

import { profileType } from 'types/common';
import { displaySuccess } from 'utils/toastMessages';

import { SettingsShow } from 'components/userProfile';

const ErrorBlock = styled.div`
  padding: 16px;
  color: #f00;
`;

export default class SettingsContent extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
    publicKeys: PropTypes.shape({}).isRequired,
    settingsData: PropTypes.shape({}).isRequired,
    isRich: PropTypes.bool,

    fetchSettings: PropTypes.func.isRequired,
    fetchAccountPermissions: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    updateProfileMeta: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isRich: false,
  };

  state = {
    isLoading: true,
    error: null,
  };

  async componentDidMount() {
    const { fetchSettings, fetchAccountPermissions } = this.props;
    this.setState({
      isLoading: true,
    });

    try {
      await Promise.all([fetchSettings(), fetchAccountPermissions()]);
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }

    this.setState({
      isLoading: false,
    });
  }

  onSubmitBlockchain = async values => {
    const { updateProfileMeta } = this.props;

    const meta = pick(
      ['name', 'gender', 'email', 'location', 'about', 'website', 'facebook', 'vk', 'instagram'],
      values
    );

    try {
      await updateProfileMeta(meta);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('updateMetaData failed:', err);

      // eslint-disable-next-line no-throw-literal
      throw {
        [FORM_ERROR]: err,
      };
    }
  };

  onSubmitGate = async options => {
    const { updateSettings } = this.props;

    try {
      await updateSettings(options);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('updateSettings failed:', err);

      // eslint-disable-next-line no-throw-literal
      throw {
        [FORM_ERROR]: err,
      };
    }

    displaySuccess(tt('settings.update_success'));
  };

  renderContent() {
    const { profile, publicKeys, isRich, settingsData } = this.props;
    const { isLoading, error } = this.state;

    if (error) {
      return <ErrorBlock>Error: {error}</ErrorBlock>;
    }

    return (
      <SettingsShow
        profile={profile}
        publicKeys={publicKeys}
        options={settingsData}
        isRich={isRich}
        isFetching={isLoading}
        onSubmitBlockchain={this.onSubmitBlockchain}
        onSubmitGate={this.onSubmitGate}
      />
    );
  }

  render() {
    const { profile } = this.props;

    return (
      <>
        <Head>
          <title>{tt('meta.title.profile.settings', { name: profile.username })}</title>
        </Head>
        {this.renderContent()}
      </>
    );
  }
}
