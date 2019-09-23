import { connect } from 'react-redux';

import { dataSelector, entitySelector } from 'store/selectors/common';
import { amIWitnessSelector } from 'store/selectors/auth';
import { fetchProposals } from 'store/actions/gate';
import { openManageCommunityDialog, openCustomProposalDialog } from 'store/actions/modals';

import ProposalPage from './ProposalPage';

export default connect(null)(ProposalPage);
