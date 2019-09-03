import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'components/golos-ui/Button';
import { CONTRACTS } from 'constants/communitySettings';

import { STEPS } from '../ManageCommunity';

const Wrapper = styled.div`
  padding: 0 30px;
  height: 60vh;
  min-height: 400px;
  overflow: auto;
`;

const StepTitle = styled.h2`
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: initial;
`;

const List = styled.ul``;

const Item = styled.li`
  margin: 2px 0;
  list-style: none;
`;

const PseudoLink = styled.a`
  padding: 8px 6px;
  margin-left: -6px;
  cursor: pointer;
`;

const FooterButtons = styled.div`
  padding: 8px 30px 0;

  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

export default class ChooseAction extends PureComponent {
  onItemClick = actionName => {
    const { data, onStepChange } = this.props;

    onStepChange({
      step: STEPS.CHANGE_PARAMS,
      data: {
        contractName: data.contractName,
        actionName,
      },
    });
  };

  onBackClick = () => {
    const { onStepChange } = this.props;
    onStepChange({ step: STEPS.INITIAL });
  };

  render() {
    const { data } = this.props;

    const contract = CONTRACTS.find(contract => contract.contractName === data.contractName);

    return (
      <>
        <Wrapper>
          <StepTitle>{tt('community_settings.choose_action')}</StepTitle>
          <List>
            {contract.actions.map(action => (
              <Item key={action.name} onClick={() => this.onItemClick(action.name)}>
                <PseudoLink>{action.name}</PseudoLink>
              </Item>
            ))}
          </List>
        </Wrapper>
        <FooterButtons>
          <Button light onClick={this.onBackClick}>
            {tt('g.back')}
          </Button>
        </FooterButtons>
      </>
    );
  }
}
