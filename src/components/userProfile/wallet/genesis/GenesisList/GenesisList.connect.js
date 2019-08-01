import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { dataSelector } from 'store/selectors/common';
import { getGenesisConversions } from 'store/actions/gate';
import GenesisList from './GenesisList';

export default compose(
  withRouter,
  connect(
    (state, { router }) => {
      const genesis = dataSelector(['wallet', router.query.userId, 'genesis'])(state);
      return {
        isLoading: Boolean(genesis?.isLoading),
        items: genesis?.items || [],
      };
    },
    {
      getGenesisConversions,
    }
  )
)(GenesisList);
