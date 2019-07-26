import { connect } from 'react-redux';

import { setPublishParams, execProposal } from 'store/actions/cyberway';
import { waitForTransaction, getCommunitySettings } from 'store/actions/gate';

import ManageCommunity from './ManageCommunity';

export default connect(
  null,
  {
    setPublishParams,
    execProposal,
    waitForTransaction,
    getCommunitySettings,
  }
)(ManageCommunity);
