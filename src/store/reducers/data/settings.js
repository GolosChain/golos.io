import { mergeDeepRight } from 'ramda';
import { FETCH_SETTINGS_SUCCESS, UPDATE_SETTINGS_SUCCESS } from 'store/constants';
import { AUCTION_REWARD_DESTINATION, DEFAULT_CURRENCY, DEFAULT_LOCALE } from 'constants/config';

const initialState = {
  basic: {
    rounding: 3,
    selfVote: false,
    nsfw: 'warn',
    lang: DEFAULT_LOCALE,
    currency: DEFAULT_CURRENCY,
    votePower: null,
    selectedTags: {},
    auctionRewardDestination: AUCTION_REWARD_DESTINATION.DEFAULT,
  },
  notify: {
    show: {
      upvote: true,
      downvote: true,
      transfer: true,
      reply: true,
      mention: true,
      reward: true,
      curatorReward: true,
    },
  },
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_SETTINGS_SUCCESS:
      return mergeDeepRight(state, payload);

    case UPDATE_SETTINGS_SUCCESS:
      return mergeDeepRight(state, meta.options);

    default:
      return state;
  }
}
