import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'components/golos-ui/Button';

import { CONTRACTS } from '../structures';
import { STEPS } from '../ManageCommunity';

const Wrapper = styled.div`
  padding: 10px 30px 0;
  height: 60vh;
  min-height: 400px;
  overflow: auto;
`;

const Hint = styled.h2`
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: initial;
`;

const List = styled.ul``;

const Item = styled.li`
  margin: 0 0 14px;
  list-style: none;
`;

const Contract = styled.button`
  padding: 11px 14px;
  border: 1px solid #999;
  border-radius: 8px;
  text-align: initial;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: #eff5ff;
  }
`;

const ContractName = styled.h3`
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
`;

const ContractDescription = styled.div``;

const FooterButtons = styled.div`
  padding: 8px 30px 0;

  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

export default class ChooseContract extends PureComponent {
  onClick = contractName => {
    const { onStepChange } = this.props;

    onStepChange({
      step: STEPS.CHANGE_PARAMS,
      data: {
        contractName,
      },
    });
  };

  onCancelClick = () => {
    const { onClose } = this.props;
    onClose();
  };

  renderContractLine = ({ contractName }) => (
    <Item key={contractName}>
      <Contract onClick={() => this.onClick(contractName)}>
        <ContractName>{contractName}</ContractName>
        <ContractDescription>
          {contractName} is lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
          commodi eveniet ipsa nam porro, quaerat repellendus saepe sequi ullam ut, vero vitae
          voluptatem voluptates. Animi deleniti laboriosam suscipit tempora voluptates!
        </ContractDescription>
      </Contract>
    </Item>
  );

  render() {
    return (
      <>
        <Wrapper>
          <Hint>Choose contract to change settings:</Hint>
          <List>{CONTRACTS.map(this.renderContractLine)}</List>
        </Wrapper>
        <FooterButtons>
          <Button light onClick={this.onCancelClick}>
            {tt('g.cancel')}
          </Button>
        </FooterButtons>
      </>
    );
  }
}
