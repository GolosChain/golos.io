import { connect } from 'react-redux';

import { waitForTransaction } from 'store/actions/gate';
import { setParams, setRules, setChargeRestorer } from 'store/actions/cyberway';

import ContractSettings from './ContractSettings';

export default connect(
  null,
  {
    setParams,
    setRules,
    setChargeRestorer,
    waitForTransaction,
  },
  null,
  {
    forwardRef: true,
  }
)(ContractSettings);
