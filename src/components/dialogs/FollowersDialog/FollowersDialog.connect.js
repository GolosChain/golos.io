import { connect } from 'react-redux';

import { entitySelector, dataSelector } from 'store/selectors/common';
import { getSubscriptions, getSubscribers } from 'store/actions/gate';

import FollowersDialog from './FollowersDialog';

export default connect(
  (state, props) => {
    const profile = entitySelector('profiles', props.userId)(state);
    const data = dataSelector(props.type === 'followers' ? 'subscribers' : 'subscriptions')(state);

    return {
      items: data.items,
      isEnd: data.isEnd,
      isLoading: data.isLoading,
      sequenceKey: data.sequenceKey,
      profile,
    };
  },
  {
    getSubscriptions,
    getSubscribers,
  }
)(FollowersDialog);
