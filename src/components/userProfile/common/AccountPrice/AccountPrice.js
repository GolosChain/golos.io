import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { getAccountPrice } from 'app/redux/selectors/account/accountPrice';
import { formatCurrency } from 'helpers/currency';
import { displayError } from 'utils/toastMessages';

import LoadingIndicator from 'components/elements/LoadingIndicator';

const FONT_MULTIPLIER = 48;

const Body = styled.div`
  height: 103px;
  padding: 0 14px;
  border-bottom: 1px solid #e9e9e9;
  line-height: 102px;
  text-align: center;
  font-size: ${props => props.fontSize}px;
  font-weight: bold;
  white-space: nowrap;
  color: #3684ff;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Loader = styled(LoadingIndicator).attrs({ type: 'circle', center: true, size: 50 })``;

export default class AccountPrice extends PureComponent {
  static propTypes = {
    price: PropTypes.number,
    currency: PropTypes.string,
    userId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,

    getBalance: PropTypes.func.isRequired,
    getVestingBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    price: 0,
    currency: 'GOLOS',
    isLoading: false,
  };

  state = {
    isAlreadyTryToLoad: false,
  };

  async componentDidMount() {
    const { getBalance, getVestingBalance, userId } = this.props;

    try {
      await Promise.all([getBalance(userId), getVestingBalance(userId)]);
      this.setState({
        isAlreadyTryToLoad: true,
      });
    } catch (err) {
      displayError('Cannot load user balance', err);
    }
  }

  render() {
    const { price, currency, isLoading } = this.props;
    const { isAlreadyTryToLoad } = this.state;
    const sumString = formatCurrency(price, currency, 'adaptive');

    if (isLoading || (!price && !isAlreadyTryToLoad)) {
      return <Loader />;
    }

    return <Body fontSize={Math.floor(FONT_MULTIPLIER * (8 / sumString.length))}>{sumString}</Body>;
  }
}
