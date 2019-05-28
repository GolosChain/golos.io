import { connect } from 'react-redux';

import { setPublishParams } from 'store/actions/cyberway';

import ManageCommunity from './ManageCommunity';

export default connect(
  null,
  {
    setParams: setPublishParams,
  }
)(ManageCommunity);
