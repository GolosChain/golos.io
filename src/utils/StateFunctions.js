import assert from 'assert';
import { Long } from 'bytebuffer';
import { has, intersection } from 'ramda';

import { parsePayoutAmount, repLog10 } from 'utils/ParsersAndFormatters';
import { VEST_TICKER, LIQUID_TICKER } from 'constants/config';
import normalizeProfile from 'utils/NormalizeProfile';

function getStoreState() {
  throw new Error('MOCK');
}

const DEFAULT_DATE = '1970-01-01T00:00:00';
const FETCH_DATA_EXPIRE_SEC = 15;

export const toAsset = value => {
  const [amount, symbol] = value.split(' ');

  return {
    amount: parseFloat(amount),
    symbol,
  };
};

export function vestsToGolosPower(globalProps, vestingShares) {
  const vests = parseFloat(vestingShares);
  const total_vests = assetFloat(globalProps.get('total_vesting_shares'), VEST_TICKER);
  const total_vest_golos = assetFloat(globalProps.get('total_vesting_fund_steem'), LIQUID_TICKER);
  const vesting_golosf = total_vest_golos * (vests / total_vests);
  const golosPower = vesting_golosf.toFixed(3);
  return golosPower;
}

export function vestsToGolos(vestingShares, gprops) {
  const { total_vesting_fund_steem, total_vesting_shares } = gprops;
  const totalVestingFundGolos = toAsset(total_vesting_fund_steem).amount;
  const totalVestingShares = toAsset(total_vesting_shares).amount;
  const vesting_shares = toAsset(vestingShares).amount;
  return (totalVestingFundGolos * (vesting_shares / totalVestingShares)).toFixed(3);
}

export function vestsToGolosEasy(amount) {
  return vestsToGolos(amount, getStoreState().global.props);
}

export function golosToVests(golos, gprops, returnFloat) {
  const { total_vesting_fund_steem, total_vesting_shares } = gprops;
  const totalVestingFundGolos = toAsset(total_vesting_fund_steem).amount;
  const totalVestingShares = toAsset(total_vesting_shares).amount;
  const vests = golos / (totalVestingFundGolos / totalVestingShares);

  if (returnFloat) {
    return vests;
  }

  return vests.toFixed(6);
}

export function assetFloat(str, asset) {
  try {
    assert.equal(typeof str, 'string');
    assert.equal(typeof asset, 'string');
    assert(
      new RegExp(`^\\d+(\\.\\d+)? ${asset}$`).test(str),
      `Asset should be formatted like 99.99 ${asset}: ${str}`
    );
    return parseFloat(str.split(' ')[0]);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export function isFetchingOrRecentlyUpdated(global_status, order, category) {
  const status = global_status ? global_status.getIn([category || '', order]) : null;
  if (!status) return false;
  if (status.fetching) return true;
  if (status.lastFetch) {
    return Date.now() - status.lastFetch < FETCH_DATA_EXPIRE_SEC * 1000;
  }
  return false;
}

export function contentStats(content) {
  if (!content) return {};

  let net_rshares_adj = Long.ZERO;
  let neg_rshares = Long.ZERO;
  let total_votes = 0;
  let up_votes = 0;

  content.get('active_votes').forEach(v => {
    const sign = Math.sign(v.get('percent'));
    if (sign === 0) return;
    total_votes += 1;
    if (sign > 0) up_votes += 1;

    const rshares = String(v.get('rshares'));

    // For flag weight: count total neg rshares
    if (sign < 0) {
      neg_rshares = neg_rshares.add(rshares);
    }

    // For graying: sum up total rshares from voters with non-neg reputation.
    if (String(v.get('reputation')).substring(0, 1) !== '-') {
      // And also ignore tiny downvotes (9 digits or less)
      if (!(rshares.substring(0, 1) === '-' && rshares.length < 11)) {
        net_rshares_adj = net_rshares_adj.add(rshares);
      }
    }
  });

  // take negative rshares, divide by 2, truncate 10 digits (plus neg sign), count digits.
  // creates a cheap log10, stake-based flag weight. 1 = approx $400 of downvoting stake; 2 = $4,000; etc
  const flagWeight = Math.max(String(neg_rshares.div(2)).length - 11, 0);

  // post must have non-trivial negative rshares to be grayed out. (more than 10 digits)
  const grayThreshold = -9999999999;
  const meetsGrayThreshold = net_rshares_adj.compare(grayThreshold) < 0;

  const hasPositiveRshares = Long.fromString(String(content.get('net_rshares'))).gt(Long.ZERO);
  const allowDelete = !hasPositiveRshares && content.get('children') === 0;
  const hasPendingPayout = parsePayoutAmount(content.get('pending_payout_value')) >= 0.02;
  const authorRepLog10 = repLog10(content.get('author_reputation'));

  const gray =
    !hasPendingPayout && (authorRepLog10 < 1 || (authorRepLog10 < 65 && meetsGrayThreshold));
  const hide = !hasPendingPayout && authorRepLog10 < 0; // rephide
  const pictures = !gray;

  // Combine tags+category to check nsfw status
  const json = content.get('json_metadata');
  let tags = [];
  try {
    tags = (json && JSON.parse(json).tags) || [];
    if (typeof tags === 'string') {
      tags = [tags];
    }
    if (!Array.isArray(tags)) {
      tags = [];
    }
  } catch (e) {
    tags = [];
  }
  tags.push(content.get('category'));

  tags = filterTags(tags);

  const isNsfw = tags.filter(tag => tag && tag.match(/^nsfw$|^ru--mat$|^18\+$/i)).length > 0;

  return {
    hide,
    gray,
    pictures,
    authorRepLog10,
    allowDelete,
    isNsfw,
    flagWeight,
    total_votes,
    up_votes,
    hasPendingPayout,
  };
}

export function hasReblog(content) {
  return content.has('first_reblogged_on') && content.get('first_reblogged_on') !== DEFAULT_DATE;
}

export function extractReblogData(content) {
  if (!content) {
    return {};
  }

  const isRepost = hasReblog(content);

  if (!isRepost) {
    return {};
  }

  const isFeed = content.has('first_reblogged_by');
  const repostAuthor = isFeed
    ? content.getIn(['reblog_entries', 0, 'author'])
    : content.get('reblog_author');
  const date = content.get('first_reblogged_on');
  const title = isFeed
    ? content.getIn(['reblog_entries', 0, 'title'])
    : content.get('reblog_title');
  const body = isFeed ? content.getIn(['reblog_entries', 0, 'body']) : content.get('reblog_body');
  const json_metadata = isFeed
    ? content.getIn(['reblog_entries', 0, 'json_metadata'])
    : content.get('reblog_json_metadata');

  return {
    isRepost,
    repostAuthor,
    date,
    title,
    body,
    metadata: json_metadata ? JSON.parse(json_metadata) : {},
  };
}

export function isHide(post) {
  if (!post) {
    return false;
  }
  if (post instanceof Map) {
    return post.get('json_metadata').startsWith('{"hash"');
  }
  return post.metadata ? has('hash', post.metadata) : false;
}

function filterTags(tags) {
  return tags.filter(tag => typeof tag === 'string');
}

export function fromJSGreedy(js) {
  return typeof js !== 'object' || js === null
    ? js
    : Array.isArray(js)
    ? Seq(js)
        .map(fromJSGreedy)
        .toList()
    : Seq(js)
        .map(fromJSGreedy)
        .toMap();
}

export function calcVotesStats(votes, me) {
  const stats = {
    likes: 0,
    firstLikes: [],
    dislikes: 0,
    firstDislikes: [],
    myVote: null,
  };

  for (const { voter, percent } of votes) {
    if (voter === me) {
      if (percent > 0) {
        stats.myVote = 'like';
      } else if (percent < 0) {
        stats.myVote = 'dislike';
      }
    }

    if (percent > 0) {
      stats.likes++;

      if (stats.likes <= 10) {
        stats.firstLikes.push(voter);
      }
    } else if (percent < 0) {
      stats.dislikes++;

      if (stats.dislikes <= 10) {
        stats.firstDislikes.push(voter);
      }
    }
  }

  return stats;
}

export function getVesting(account, props) {
  const vesting = parseFloat(account.vesting_shares);
  const delegated = parseFloat(account.delegated_vesting_shares);

  const availableVesting = vesting - delegated;

  return {
    gests: availableVesting,
    golos: vestsToGolos(`${availableVesting.toFixed(6)} GESTS`, props),
  };
}

export function buildAccountNameAutocomplete(transferHistory, following) {
  return transferHistory
    .reduce((acc, cur) => {
      if (cur.getIn([1, 'op', 0]) === 'transfer') {
        const username = cur.getIn([1, 'op', 1, 'to']);
        return acc.add(username);
      }
      return acc;
    }, new Set())
    .merge(following)
    .sort()
    .toArray();
}

export function compareActiveVotes(a, b) {
  return Math.abs(parseInt(b.get('rshares'))) - Math.abs(parseInt(a.get('rshares')));
}
