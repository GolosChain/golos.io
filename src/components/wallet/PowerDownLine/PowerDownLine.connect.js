import { connect } from 'react-redux';

// import { powerDownSelector } from 'app/redux/selectors/wallet/powerDown';
import { stopWithdrawTokens } from 'store/actions/cyberway/vesting';

import PowerDownLine from './PowerDownLine';

export default connect(
  null,
  {
    showNotification: () => () => console.error('Unhandled action'),
    stopWithdrawTokens,
  }
)(PowerDownLine);
