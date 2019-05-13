import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { getAccountPrice } from 'app/redux/selectors/account/accountPrice';
import { formatCurrency } from 'helpers/currency';

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

export default class AccountPrice extends PureComponent {
  static propTypes = {
    price: PropTypes.number,
    currency: PropTypes.string,
    userId: PropTypes.string.isRequired,
    getBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    price: 0,
    currency: '',
  };

  async componentDidMount() {
    const { price, getBalance, userId } = this.props;

    if (!price) {
      try {
        await getBalance(userId);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    }
  }

  render() {
    const { price, currency } = this.props;

    const sumString = formatCurrency(price, currency, 'adaptive');

    return <Body fontSize={Math.floor(FONT_MULTIPLIER * (8 / sumString.length))}>{sumString}</Body>;
  }
}
