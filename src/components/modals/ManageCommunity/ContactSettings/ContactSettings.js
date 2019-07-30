import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { displaySuccess, displayError } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';
import SplashLoader from 'components/golos-ui/SplashLoader/SplashLoader';
import DialogManager from 'components/elements/common/DialogManager';
import { Router } from 'shared/routes';

import { CONTRACTS } from '../structures';
import { STEPS } from '../ManageCommunity';
import StructureWrapper from '../StructureWrapper';

const Wrapper = styled.div`
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

export default class Step2 extends PureComponent {
  static propTypes = {
    setPublishParams: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    isSaving: false,
    hasChanges: false,
    updates: {},
  };

  onSaveClick = async () => {
    const { setPublishParams, waitForTransaction, onClose } = this.props;
    const { updates } = this.state;

    this.setState({
      isSaving: true,
    });

    try {
      const { transaction_id } = await setPublishParams({ updates });
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

  renderStructure = (contractName, { name, title, Component }) => {
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
    const { isSaving, updates, hasChanges } = this.state;

    const isInvalid = [...Object.values(updates)].some(data => data === 'INVALID');

    return (
      <>
        <Wrapper>{this.renderContract(CONTRACTS[0])}</Wrapper>
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
