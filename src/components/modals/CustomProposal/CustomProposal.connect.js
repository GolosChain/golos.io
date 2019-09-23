import { connect } from 'react-redux';

import { createCustomProposal, getTopLeaders } from 'store/actions/cyberway';

import CustomProposal from './CustomProposal';

export default connect(
  null,
  {
    createCustomProposal,
    getTopLeaders,
  }
)(CustomProposal);
