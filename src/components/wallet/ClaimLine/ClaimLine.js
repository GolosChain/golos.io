import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';

const Text = styled.div`
  flex: 1;
  margin-left: 18px;
`;

const Line = styled.div`
  line-height: 20px;
  font-size: 14px;
  color: #393636;

  @media (max-width: 500px) {
    font-size: 16px;
  }
`;

const ButtonWrapper = styled.div`
  margin: 0 20px 0 10px;
`;

const ButtonStyled = styled(Button)`
  font-size: 14px;
`;

const ActionIcon = styled(Icon)`
  height: 17px;
  margin-right: 2px;
`;

const Amount = styled.span`
  font-weight: bold;
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 0;
  border: 1px solid #e9e9e9;
  border-radius: 7px 7px 0 0;
  background: #f8f8f8;

  @media (max-width: 890px) {
    border-radius: 0;
  }

  @media (max-width: 850px) {
    flex-direction: column;

    ${Line} {
      line-height: 24px;
    }

    ${Text} {
      margin: 0 18px;
    }

    ${ButtonWrapper} {
      margin: 10px auto 4px;
    }
  }
`;

export default class ClaimLine extends Component {
  static propTypes = {
    // connect
    isOwner: PropTypes.bool.isRequired,
    unclaimedBalance: PropTypes.number,
    claimToken: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unclaimedBalance: 0,
  };

  onClaimlClick = async () => {
    const { unclaimedBalance, claimToken } = this.props;

    await claimToken(`${parseFloat(unclaimedBalance).toFixed(3)} GOLOS`);
  };

  render() {
    const { isOwner, unclaimedBalance } = this.props;

    if (!isOwner) {
      return null;
    }

    if (!unclaimedBalance) {
      return null;
    }

    return (
      <Root>
        <Text>
          <Line>
            {tt('wallet.claim_balance')} <Amount>{`${unclaimedBalance} GOLOS`}</Amount>
          </Line>
        </Text>
        <ButtonWrapper>
          <ButtonStyled onClick={this.onClaimlClick}>
            <ActionIcon name="coins" />
            {tt('wallet.claim_button')}
          </ButtonStyled>
        </ButtonWrapper>
      </Root>
    );
  }
}
