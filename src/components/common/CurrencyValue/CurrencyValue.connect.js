import { connect } from 'react-redux';

import CurrencyValue from './CurrencyValue';

export default connect(state => ({
  // settings: dataSelector('settings')(state),
  // rates: dataSelector('rates')(state),
  settings: {},
  rates: {},
}))(CurrencyValue);
