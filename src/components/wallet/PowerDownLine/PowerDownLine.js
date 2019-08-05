import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import ToastsManager from 'toasts-manager';

import { parsePayoutAmount } from 'utils/ParsersAndFormatters';
import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';
import DialogManager from 'components/elements/common/DialogManager';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';

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
  background: #f8f8f8;
`;

const ActionIcon = styled(Icon)`
  height: 17px;
  margin-right: 2px;
`;

const TimeAgoStyled = styled(TimeAgoWrapper)`
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

export default class PowerDownLine extends Component {
  static propTypes = {
    // connect
    isOwner: PropTypes.bool.isRequired,
    toWithdraw: PropTypes.number,
    quantity: PropTypes.string,
    nextPayout: PropTypes.string,
    stopWithdrawTokens: PropTypes.func.isRequired,
  };

  static defaultProps = {
    toWithdraw: 0,
    quantity: '',
    nextPayout: '',
  };

  onCancelClick = async () => {
    const { stopWithdrawTokens } = this.props;

    try {
      await stopWithdrawTokens();
      ToastsManager.info(tt('wallet.success'));
    } catch (err) {
      if (err === 'Canceled') {
        // Do nothing
      } else {
        DialogManager.alert(err, tt('g.error'));
      }
    }
  };

  render() {
    const { isOwner, toWithdraw, quantity, nextPayout } = this.props;

    if (!isOwner) {
      return null;
    }

    if (!toWithdraw) {
      return null;
    }

    const withdrawn = parseFloat(parsePayoutAmount(quantity) - toWithdraw).toFixed(6);

    return (
      <Root>
        <Text>
          <Line>
            {tt('wallet.power_down_line', {
              all: toWithdraw,
              done: withdrawn,
            }).replace(/\*\*/g, '')}
          </Line>
          <Line>
            {tt('wallet.next_power_down_date')}
            <TimeAgoStyled date={nextPayout} />
          </Line>
        </Text>
        <ButtonWrapper>
          <ButtonStyled light onClick={this.onCancelClick}>
            <ActionIcon name="round-cross" />
            {tt('wallet.cancel')}
          </ButtonStyled>
        </ButtonWrapper>
      </Root>
    );
  }
}
