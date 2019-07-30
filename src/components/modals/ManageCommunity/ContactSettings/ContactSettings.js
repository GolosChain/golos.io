import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { displaySuccess, displayError } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';
import { Input } from 'components/golos-ui/Form';
import SplashLoader from 'components/golos-ui/SplashLoader/SplashLoader';
import DialogManager from 'components/elements/common/DialogManager';
import { Router } from 'shared/routes';

import { CONTRACTS } from '../structures';
import { STEPS } from '../ManageCommunity';
import StructureWrapper from '../StructureWrapper';

const Wrapper = styled.div`
  padding: 0 30px;
  height: 60vh;
  min-height: 400px;
  overflow: auto;
`;

const VestingParams = styled.div`
  margin-top: 8px;
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

export default class ContactSettings extends PureComponent {
  static propTypes = {
    setParams: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    symbol: '',
    isSaving: false,
    hasChanges: false,
    updates: {},
  };

  onSaveClick = async () => {
    const { data, setParams, waitForTransaction, onClose } = this.props;
    const { updates, symbol } = this.state;

    this.setState({
      isSaving: true,
    });

    const { contractName } = data;

    try {
      let params = null;

      if (contractName === 'vesting') {
        params = { symbol };
      }

      const { transaction_id } = await setParams({ contractName, updates, params });
      displaySuccess('Success');
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
      (await DialogManager.dangerConfirm('Внесенные изменения будут сброшены.\n\nВы уверены?'))
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

  onSymbolChange = e => {
    this.setState({
      symbol: e.target.value,
    });
  };

  renderStructure = (contractName, { name, title, fields = {}, Component }) => {
    const { currentSettings } = this.props;
    const { updates } = this.state;

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
            fields={fields}
            initialValues={values}
            onChange={data => this.onChange(name, data)}
          />
        ) : null}
      </StructureWrapper>
    );
  };

  renderContract = () => {
    const { data } = this.props;
    const { symbol } = this.state;

    const { contractName, structures } = CONTRACTS.find(
      contact => contact.contractName === data.contractName
    );

    return (
      <ContractGroup>
        <ContractName>Contract: {contractName}</ContractName>
        {data.contractName === 'vesting' ? (
          <VestingParams>
            Vesting symbol: <Input value={symbol} onChange={this.onSymbolChange} />
          </VestingParams>
        ) : null}
        <Structures>
          {structures.map(structure => this.renderStructure(contractName, structure))}
        </Structures>
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
              Создать предложение
            </Button>
          ) : null}
          <Button light onClick={this.onCancelClick}>
            Назад
          </Button>
        </FooterButtons>
        {isSaving ? <SplashLoader /> : null}
      </>
    );
  }
}
