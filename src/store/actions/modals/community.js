import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_CUSTOM_PROPOSAL, SHOW_MODAL_MANAGE_COMMUNITY } from 'store/constants';

export const openManageCommunityDialog = () => openModal(SHOW_MODAL_MANAGE_COMMUNITY);

export const openCustomProposalDialog = () => openModal(SHOW_MODAL_CUSTOM_PROPOSAL);
