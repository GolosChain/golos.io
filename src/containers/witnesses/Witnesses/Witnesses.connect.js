import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { fetchLeaders } from 'store/actions/gate';

import Witnesses from './Witnesses';

export default connect(
  state => {
    const witness = dataSelector('witness')(state);

    return {
      items: witness.items,
      isEnd: witness.isEnd,
      isLoading: witness.isLoading,
      isError: witness.isError,
      sequenceKey: witness.sequenceKey,
    };
  },
  {
    fetchLeaders,
  }
)(Witnesses);
