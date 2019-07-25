import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { Router } from 'shared/routes';
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
import StructureWrapper from './StructureWrapper';

const CONTRACTS = [
  {
    contractName: 'publish',
    structures: [
      {
        name: 'st_max_vote_changes',
        title: 'Максимальное количество смен голоса',
        Component: MaxVoteChanges,
      },
      { name: 'st_cashout_window', title: 'Окно выплат', Component: CashoutWindow },
      { name: 'st_max_beneficiaries', title: 'Максимум бенефициаров', Component: MaxBeneficiaries },
      {
        name: 'st_max_comment_depth',
        title: 'Вложенность комментариев',
        Component: MaxCommentDepth,
      },
      { name: 'st_social_acc', title: 'Социальный аккаунт', Component: SocialAcc },
      { name: 'st_referral_acc', title: 'Реферальный аккаунт', Component: ReferralAcc },
      {
        name: 'st_curators_prcnt',
        title: 'Проценты кураторской выплаты',
        Component: CuratorPercent,
      },
      { name: 'st_bwprovider', title: 'Предоставление bandwidth', Component: BwProvider },
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
    waitForTransaction: PropTypes.func.isRequired,
    getCommunitySettings: PropTypes.func.isRequired,
  };

  state = {
    isSaving: false,
    updates: {},
    currentSettings: null,
  };

  componentDidMount() {
    this.loadCurrentSettings();
  }

  async loadCurrentSettings() {
    const { getCommunitySettings } = this.props;

    const { contracts } = await getCommunitySettings();

    this.setState({
      currentSettings: contracts,
    });
  }

  onSaveClick = async () => {
    const { setPublishParams, waitForTransaction, close } = this.props;
    const { updates } = this.state;

    this.setState({
      isSaving: true,
    });

    try {
      const { transaction_id } = await setPublishParams({ updates });
      displaySuccess('Success');
      close();
      await waitForTransaction(transaction_id);
      Router.replaceRoute(Router.asPath);
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

  onChange = (contractName, struct) => {
    const { updates } = this.state;

    this.setState({
      updates: {
        ...updates,
        [contractName]: struct,
      },
      hasChanges: true,
    });
  };

  renderStructure = (contractName, { name, title, Component }) => {
    const { updates, currentSettings } = this.state;

    if (!Component) {
      console.warn(`No component for type ${name}`);
      return;
    }

    const values = currentSettings?.[contractName]?.[name] || {};

    return (
      <StructureWrapper key={name} title={title} hasChanges={Boolean(updates[name])}>
        {currentSettings ? (
          <Component
            structureName={name}
            initialValues={values}
            onChange={data => this.onChange(name, data)}
          />
        ) : null}
      </StructureWrapper>
    );
  };

  renderContract = ({ contractName, structures }) => (
    <ContractGroup key={contractName}>
      <ContractName>Contract: {contractName}</ContractName>
      <Structures>
        {structures.map(structure => this.renderStructure(contractName, structure))}
      </Structures>
    </ContractGroup>
  );

  render() {
    const { isSaving, currentSettings } = this.state;

    return (
      <Wrapper>
        <HeaderTitle>Параметры сообщества</HeaderTitle>
        <Content>{CONTRACTS.map(this.renderContract)}</Content>
        <FooterButtons>
          <Button disabled={isSaving} onClick={this.onSaveClick}>
            Создать предложение
          </Button>
          <Button light onClick={this.onCancelClick}>
            {tt('g.cancel')}
          </Button>
        </FooterButtons>
        {isSaving || !currentSettings ? <SplashLoader /> : null}
      </Wrapper>
    );
  }
}
