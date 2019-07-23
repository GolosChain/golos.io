import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError, displaySuccess } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';
import SplashLoader from 'components/golos-ui/SplashLoader';
import MaxVoteChanges from './structures/MaxVoteChanges';
import CashoutWindow from './structures/CashoutWindow';
import MaxBeneficiaries from './structures/MaxBeneficiaries';
import MaxCommentDepth from './structures/MaxCommentDepth';
import SocialAcc from './structures/SocialAcc';
import ReferralAcc from './structures/ReferralAcc';
import CuratorPercent from './structures/CuratorPercent';
import BwProvider from './structures/BwProvider';

const CONTRACTS = [
  {
    name: 'publish',
    structures: [
      { name: 'st_max_vote_changes', Component: MaxVoteChanges },
      { name: 'st_cashout_window', Component: CashoutWindow },
      { name: 'st_max_beneficiaries', Component: MaxBeneficiaries },
      { name: 'st_max_comment_depth', Component: MaxCommentDepth },
      { name: 'st_social_acc', Component: SocialAcc },
      { name: 'st_referral_acc', Component: ReferralAcc },
      { name: 'st_curators_prcnt', Component: CuratorPercent },
      { name: 'st_bwprovider', Component: BwProvider },
    ],
  },
];

const Wrapper = styled.div`
  position: relative;
  min-width: 600px;
  padding: 20px 0 28px;
  border-radius: 6px;
  background-color: #fff;
`;

const HeaderTitle = styled.h1`
  padding: 0 30px 0;
  margin: 0 0 10px 0;
`;

const Content = styled.div`
  padding: 10px 30px 0;
  height: 60vh;
  min-height: 400px;
  overflow: auto;
`;

const ContractGroup = styled.div`
  margin: 0 0 8px;
`;

const ContractName = styled.h2`
  border-bottom: 1px solid #000;
`;

const Structures = styled.ul`
  margin: 8px 0;
`;

const FooterButtons = styled.div`
  padding: 8px 30px 0;

  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

export default class ManageCommunity extends PureComponent {
  static propTypes = {
    close: PropTypes.func.isRequired,
    setPublishParams: PropTypes.func.isRequired,
  };

  state = {
    isSaving: false,
    updates: {},
    hasChanges: false,
  };

  onSaveClick = async () => {
    const { setPublishParams, close } = this.props;
    const { updates } = this.state;

    this.setState({
      isSaving: true,
    });

    try {
      await setPublishParams({ updates });
      displaySuccess('Success');
      close();
      return;
    } catch (err) {
      displayError(err);
    }

    this.setState({
      isSaving: false,
    });
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  onChange = (name, struct) => {
    const { updates } = this.state;

    this.setState({
      updates: {
        ...updates,
        [name]: struct,
      },
      hasChanges: true,
    });

    console.log('UPDATE:', name, struct);
  };

  render() {
    const { isSaving, updates } = this.state;

    return (
      <Wrapper>
        <HeaderTitle>Параметры сообщества</HeaderTitle>
        <Content>
          {CONTRACTS.map(({ name, structures }) => (
            <ContractGroup key={name}>
              <ContractName>Contract: {name}</ContractName>
              <Structures>
                {structures.map(({ name, Component }) => {
                  if (!Component) {
                    console.warn(`No component for type ${name}`);
                    return;
                  }

                  return (
                    <Component
                      key={name}
                      structureName={name}
                      hasChanges={Boolean(updates[name])}
                      onChange={data => this.onChange(name, data)}
                    />
                  );
                })}
              </Structures>
            </ContractGroup>
          ))}
        </Content>
        <FooterButtons>
          <Button disabled={isSaving} onClick={this.onSaveClick}>
            Сохранить
          </Button>
          <Button light onClick={this.onCancelClick}>
            {tt('g.cancel')}
          </Button>
        </FooterButtons>
        {isSaving ? <SplashLoader /> : null}
      </Wrapper>
    );
  }
}
