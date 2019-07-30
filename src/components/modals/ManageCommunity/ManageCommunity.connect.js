import { connect } from 'react-redux';

import { getCommunitySettings } from 'store/actions/gate';

import ManageCommunity from './ManageCommunity';

export default connect(
  null,
  {
    getCommunitySettings,
  }
)(ManageCommunity);
