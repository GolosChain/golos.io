import { CALL_GATE } from 'store/middlewares/gate-api';

export const getCommunitySettings = () => {
  return {
    [CALL_GATE]: {
      method: 'content.getCommunitySettings',
      params: {
        communityId: 'gls',
      },
    },
  };
};
