import cyber from 'cyber-client';

import { currentUserIdSelector } from 'store/selectors/auth';
import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

export const setPublishParams = ({ curatorMin, curatorMax }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const params = {
    params: [
      [
        'st_curators_prcnt',
        {
          min_curators_prcnt: curatorMin,
          max_curators_prcnt: curatorMax,
        },
      ],
    ],
  };

  return dispatch({
    [CYBERWAY_API]: {
      contract: 'publish',
      method: 'setparams',
      params,
      msig: {
        requested: { accountName: 'gls.publish', permission: 'active' },
        expires: 36000,
      },
    },
  });
};
