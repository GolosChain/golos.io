import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displaySuccess, displayError } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';
import Icon from 'components/golos-ui/Icon';
import SplashLoader from 'components/golos-ui/SplashLoader/SplashLoader';
import DialogManager from 'components/elements/common/DialogManager';
import { Router } from 'shared/routes';

import { CONTRACTS } from 'constants/communitySettings';
import { STRUCTURES } from '../structures';
import { STEPS } from '../ManageCommunity';
import StructureWrapper from '../StructureWrapper';

const Wrapper = styled.div`
  padding: 0 30px;
  height: 60vh;
  min-height: 400px;
  overflow: auto;
`;

const ContractGroup = styled.div`
  margin: 0 0 8px;
`;

const ContractNameWrapper = styled.h2`
  display: flex;
  align-items: center;
  padding-bottom: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid #000;
`;

const ContractName = styled.span`
  flex-grow: 1;
  flex-shrink: 0;
`;

const DescriptionLink = styled.a`
  flex-shrink: 0;
  font-size: 16px;
  font-weight: normal;
`;

const LinkIcon = styled(Icon)`
  width: 14px;
  height: 14px;
  margin-right: 5px;
`;

const ActionWrapper = styled.div``;

const ActionName = styled.h3``;

const Description = styled.div`
  margin: 4px 0 9px;
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

export default class ContractSettings extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    setParams: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    isSaving: false,
    hasChanges: false,
    updates: {},
  };

  onSaveClick = async () => {
    const { data, setParams, setChargeRestorer, waitForTransaction, onClose } = this.props;
    const { updates } = this.state;

    this.setState({
      isSaving: true,
    });

    const { contractName } = data;

    try {
      let transaction_id;

      if (updates.setrestorer) {
        ({ transaction_id } = await setChargeRestorer(updates.setrestorer));
      } else {
        let params = null;

        if (contractName === 'vesting') {
          params = { symbol: '6,GOLOS' };
        }

        ({ transaction_id } = await setParams({ contractName, updates, params }));
      }

      displaySuccess(tt('g.saved'));
      onClose();
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

  canClose = () => {
    return this.onCancelClick();
  };

  onCancelClick = async () => {
    const { onStepChange } = this.props;
    const { hasChanges } = this.state;

    if (
      !hasChanges ||
      (await DialogManager.dangerConfirm(tt('community_settings.confirm_reset')))
    ) {
      onStepChange({
        step: STEPS.INITIAL,
      });
    }
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

  renderStructure = (
    contractName,
    actionName,
    { name, title, fields = {}, limits = {}, fieldsTypes = {}, defaults = {}, disabled }
  ) => {
    const { currentSettings } = this.props;
    const { updates } = this.state;

    const StructureComponent = STRUCTURES[contractName]?.[actionName]?.[name];
    const values = currentSettings?.[contractName]?.[actionName]?.[name] || {};

    if (!StructureComponent) {
      console.warn(`No component for type ${name}`);
      return;
    }

    return (
      <StructureWrapper key={name} title={title} hasChanges={Boolean(updates[name])}>
        {currentSettings ? (
          <StructureComponent
            actionName={actionName}
            fields={fields}
            limits={limits}
            fieldsTypes={fieldsTypes}
            defaults={defaults}
            disabled={disabled}
            initialValues={values}
            onChange={data => this.onChange(name, data)}
          />
        ) : null}
      </StructureWrapper>
    );
  };

  renderAction = (
    contractName,
    {
      name,
      description,
      fields,
      defaults = {},
      limits = {},
      fieldsTypes = {},
      disabled,
      structures,
    }
  ) => {
    const { currentSettings } = this.props;
    let content;

    if (fields) {
      const StructureComponent = STRUCTURES[contractName]?.[name];
      const values = currentSettings?.[contractName]?.[name];

      if (StructureComponent) {
        content = (
          <>
            {description ? <Description>{description}</Description> : null}
            <StructureComponent
              actionName={name}
              fields={fields}
              limits={limits}
              fieldsTypes={fieldsTypes}
              defaults={defaults}
              initialValues={values}
              disabled={disabled}
              onChange={data => this.onChange(name, data)}
            />
          </>
        );
      } else {
        content = (
          <>
            <div>Unknown structure: {name}</div>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </>
        );
      }
    } else {
      content = (
        <Structures>
          {structures.map(structure => this.renderStructure(contractName, name, structure))}
        </Structures>
      );
    }

    return (
      <ActionWrapper>
        <ActionName>
          {tt('community_settings.action')}: {name}
        </ActionName>
        {content}
      </ActionWrapper>
    );
  };

  renderContract = () => {
    const { data } = this.props;

    const { contractName, link, actions } = CONTRACTS.find(
      contact => contact.contractName === data.contractName
    );

    let action = actions[0];

    if (data.actionName) {
      action = actions.find(({ name }) => name === data.actionName);
    }

    return (
      <ContractGroup>
        <ContractNameWrapper>
          <ContractName>
            {tt('community_settings.contract')}: {contractName}
          </ContractName>
          {link ? (
            <DescriptionLink target="_blank" href={link}>
              <LinkIcon name="external-link" />
              {tt('community_settings.description')}
            </DescriptionLink>
          ) : null}
        </ContractNameWrapper>
        {this.renderAction(contractName, action)}
      </ContractGroup>
    );
  };

  render() {
    const { isSaving, updates, hasChanges } = this.state;

    const isInvalid = [...Object.values(updates)].some(data => data === 'INVALID');

    return (
      <>
        <Wrapper>{this.renderContract()}</Wrapper>
        <FooterButtons>
          {hasChanges ? (
            <Button disabled={isSaving || isInvalid} onClick={this.onSaveClick}>
              {tt('community_settings.create_proposal')}
            </Button>
          ) : null}
          <Button light onClick={this.onCancelClick}>
            {tt('g.back')}
          </Button>
        </FooterButtons>
        {isSaving ? <SplashLoader /> : null}
      </>
    );
  }
}
