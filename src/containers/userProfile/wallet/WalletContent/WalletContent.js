/* eslint-disable no-plusplus, no-console, consistent-return */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import styled from 'styled-components';
import tt from 'counterpart';
import Head from 'next/head';

import Card from 'components/golos-ui/Card';

import { APP_DOMAIN, DONATION_FOR } from 'constants/config';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import { vestsToGolosEasy } from 'utils/StateFunctions';
import { displayError } from 'utils/toastMessages';
import WalletTabs from 'components/userProfile/wallet/WalletTabs';
import WalletLine from 'components/userProfile/wallet/WalletLine';
import PowerDownLine from 'components/wallet/PowerDownLine';
import { visuallyHidden } from 'helpers/styles';

const DEFAULT_ROWS_LIMIT = 25;

export const MAIN_TABS = {
  TRANSACTIONS: 'TRANSACTIONS',
  POWER: 'POWER',
  REWARDS: 'REWARDS',
};

export const CURRENCY = {
  ALL: 'ALL',
  GOLOS: 'GOLOS',
  GOLOS_POWER: 'GOLOS_POWER',
};

export const CURRENCY_COLOR = {
  GOLOS: '#2879ff',
  GOLOS_POWER: '#f57c02',
  GOLOS_POWER_DELEGATION: '#78c2d0;',
};

export const REWARDS_TABS = {
  HISTORY: 'HISTORY',
  STATISTIC: 'STATISTIC',
};

export const REWARDS_TYPES = {
  CURATORIAL: 'CURATORIAL',
  AUTHOR: 'AUTHOR',
  DELEGATION: 'DELEGATION',
};

export const DIRECTION = {
  ALL: 'ALL',
  SENT: 'SENT',
  RECEIVE: 'RECEIVE',
};

const Content = styled.div`
  font-family: Roboto, sans-serif;
`;

const Lines = styled.div``;

const EmptyBlock = styled.div`
  padding: 28px 20px 30px;
  font-size: 20px;
  font-weight: 500;
  color: #c5c5c5;
`;

const EmptySubText = styled.div`
  margin-top: 10px;
  line-height: 1.2em;
  font-size: 18px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  opacity: 0;
  animation: fade-in 0.25s forwards;
  animation-delay: 0.25s;
`;

const Stub = styled.div`
  padding: 20px;
  color: #777;
`;

const Header = styled.h1`
  ${visuallyHidden};
`;

function addValueIfNotZero(list, amount, currency) {
  if (!/^0+\.0+$/.test(amount)) {
    list.push({
      amount,
      currency,
    });
  }
}

export default class WalletContent extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    username: PropTypes.string,
    loggedUserId: PropTypes.string,
    transfers: PropTypes.arrayOf(PropTypes.shape({})),
    isOwner: PropTypes.bool,
    vestingSequenceKey: PropTypes.string,
    isVestingHistoryLoaded: PropTypes.bool,

    getTransfersHistory: PropTypes.func.isRequired,
    getVestingHistory: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
    getVestingBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    transfers: [],
    isOwner: false,
    vestingSequenceKey: null,
    isVestingHistoryLoaded: false,
    username: '',
  };

  state = {
    mainTab: MAIN_TABS.TRANSACTIONS,
    currency: CURRENCY.ALL,
    direction: DIRECTION.ALL,
    rewardType: REWARDS_TYPES.CURATORIAL,
    rewardTab: REWARDS_TABS.HISTORY,
    limit: DEFAULT_ROWS_LIMIT,
  };

  contentRef = createRef();

  async componentDidMount() {
    const { getBalance, getVestingBalance, userId } = this.props;
    try {
      await Promise.all([getBalance(userId), getVestingBalance(userId)]);
    } catch (err) {
      displayError('Cannot load user balance', err);
    }

    this.loadHistory();
    window.addEventListener('scroll', this.onScrollLazy);
  }

  componentWillUnmount() {
    this.onScrollLazy.cancel();
    window.removeEventListener('scroll', this.onScrollLazy);
  }

  onMainTabChange = ({ id }) => {
    this.setState({
      mainTab: id,
      currency: CURRENCY.ALL,
      direction: DIRECTION.ALL,
      rewardType: REWARDS_TYPES.CURATORIAL,
      limit: DEFAULT_ROWS_LIMIT,
    });
  };

  onCurrencyChange = ({ id }) => {
    this.setState({
      currency: id,
      limit: DEFAULT_ROWS_LIMIT,
    });
  };

  onDirectionChange = ({ id }) => {
    this.setState({
      direction: id,
      limit: DEFAULT_ROWS_LIMIT,
    });
  };

  onRewardTypeChange = ({ id }) => {
    this.setState({
      rewardType: id,
      limit: DEFAULT_ROWS_LIMIT,
    });
  };

  onScrollLazy = throttle(
    async () => {
      const { vestingSequenceKey, getVestingHistory, userId, isVestingHistoryLoaded } = this.props;
      if (
        this.contentRef.current.getBoundingClientRect().bottom < window.innerHeight * 1.2 &&
        !isVestingHistoryLoaded
      ) {
        await getVestingHistory(userId, vestingSequenceKey);
      }
    },
    500,
    { leading: false }
  );

  async loadHistory() {
    const {
      getTransfersHistory,
      userId,
      getVestingHistory,
      vestingSequenceKey,
      isVestingHistoryLoaded,
    } = this.props;

    try {
      await Promise.all([
        getTransfersHistory(userId, { isIncoming: false }),
        getTransfersHistory(userId, { isIncoming: true }),
      ]);

      if (!isVestingHistoryLoaded) {
        await getVestingHistory(userId, vestingSequenceKey);
      }
    } catch (err) {
      displayError(err);
    }
  }

  makeTransferList() {
    const { pageAccount, userId, loadRewards, transfers } = this.props;
    const { mainTab, rewardType, limit } = this.state;

    let transactions;

    if (mainTab === MAIN_TABS.REWARDS) {
      let type;
      switch (rewardType) {
        case REWARDS_TYPES.AUTHOR:
          type = 'author';
          break;
        case REWARDS_TYPES.CURATORIAL:
          type = 'curation';
          break;
        case REWARDS_TYPES.DELEGATION:
          type = 'delegation';
          break;
        default:
      }

      transactions = pageAccount.getIn(['rewards', type, 'items']);

      if (!transactions) {
        loadRewards(userId, type);
      }
    } else {
      transactions = transfers;
    }

    if (!transactions) {
      return null;
    }

    const list = [];

    this.hasMore = false;

    for (let i = transactions.length - 1; i >= 0; --i) {
      const item = transactions[i];
      const { type, timestamp, from, to, amount } = item;
      const data = {
        from,
        to,
        amount,
      };

      let line = null;

      if (mainTab === MAIN_TABS.TRANSACTIONS) {
        if (type === 'transfer' || type === 'transfer_to_vesting') {
          line = this.processTransactions(type, data, timestamp);
        }
      } else if (mainTab === MAIN_TABS.REWARDS) {
        if (
          type === 'curation_reward' ||
          type === 'author_reward' ||
          type === 'delegation_reward'
        ) {
          line = this.processRewards(type, data, timestamp);
        }
      }

      if (line) {
        line.timestamp = timestamp;
        list.push(line);

        if (list.length === limit) {
          this.hasMore = true;
          break;
        }
      }
    }

    return list;
  }

  // eslint-disable-next-line class-methods-use-this
  makeGolosPowerList() {
    // TODO: Rewrite!
    throw new Error('Not refactored from old Golos');
    /* const { myAccountName, userId, globalProps } = this.props;
    const { delegationData, direction } = this.state;

    const list = [];

    for (let i = delegationData.length - 1; i >= 0; i--) {
      const item = delegationData[i];
      const isReceive = item.delegatee === userId;
      const isSent = item.delegator === userId;

      if (
        direction === DIRECTION.ALL ||
        (direction === DIRECTION.SENT && isSent) ||
        (direction === DIRECTION.RECEIVE && isReceive)
      ) {
        const sign = isReceive ? '+' : '-';

        const amount = vestsToGolos(item.vesting_shares, globalProps);
        const currency = CURRENCY.GOLOS_POWER;

        const timestamp = new Date(`${item.min_delegation_time}Z`);

        list.push({
          id: item.id,
          type: isReceive ? DIRECTION.RECEIVE : DIRECTION.SENT,
          name: isReceive ? item.delegator : item.delegatee,
          amount: sign + amount,
          currency,
          memo: item.memo || null,
          icon: 'voice',
          color: isReceive ? CURRENCY_COLOR.GOLOS_POWER_DELEGATION : null,
          showDelegationActions: item.delegator === myAccountName,
          timestamp,
        });
      }
    }

    return list; */
  }

  processTransactions(type, data) {
    const { userId, username } = this.props;
    const { currency, direction } = this.state;

    const samePerson = data.to === data.from;
    const isSent = data.from === userId || data.from === username;
    const isReceive = (data.to === userId || data.to === username) && !samePerson;

    if (
      direction === DIRECTION.ALL ||
      (direction === DIRECTION.RECEIVE && isReceive) ||
      (direction === DIRECTION.SENT && isSent)
    ) {
      // eslint-disable-next-line prefer-const
      let [amount, opCurrency] = data.amount.split(' ');

      if (type === 'transfer_to_vesting') {
        opCurrency = CURRENCY.GOLOS_POWER;
      }

      if (/^0\.0+$/.test(amount)) {
        return;
      }

      const sign = isReceive || type === 'transfer_from_savings' ? '+' : '-';

      if (currency === CURRENCY.ALL || currency === opCurrency) {
        if (type === 'transfer_to_vesting') {
          const options = {};

          if (samePerson) {
            options.title = tt('user_wallet.content.power_up');
            options.currencies = [
              {
                // TODO: should be replaced with VestingToGolos count
                amount: `-${amount}`,
                currency: CURRENCY.GOLOS,
              },
              {
                amount: `+${amount}`,
                currency: CURRENCY.GOLOS_POWER,
              },
            ];
          } else {
            const name = isReceive ? data.from : data.to;

            options.name = samePerson ? null : name;
            options.amount = sign + amount;
            options.currency = CURRENCY.GOLOS_POWER;
          }

          return {
            type: isReceive ? DIRECTION.RECEIVE : DIRECTION.SENT,
            memo: data.memo || null,
            icon: 'logo',
            color: '#f57c02',
            ...options,
          };
        }
        let { memo } = data;
        let memoIconText = null;

        if (memo) {
          let donatePostUrl;

          if (memo.startsWith('{')) {
            try {
              const memoData = JSON.parse(memo);

              if (memoData.donate && memoData.donate.post) {
                donatePostUrl = memoData.donate.post;
              }
            } catch (err) {
              console.warn(err);
            }
          } else if (memo.startsWith(DONATION_FOR)) {
            const otherPart = memo.substr(DONATION_FOR.length).trim();

            if (/^\/[a-z0-9.-]+\/@[a-z0-9.-]+\/[^\s]+$/.test(otherPart)) {
              donatePostUrl = otherPart;
            }
          }

          if (donatePostUrl) {
            memo = tt('dialogs_transfer.post_donation', {
              url: `https://${APP_DOMAIN}${donatePostUrl}`,
            });
            memoIconText = tt('user_wallet.content.donate');
          }
        }

        return {
          type: isReceive ? DIRECTION.RECEIVE : DIRECTION.SENT,
          name: isReceive ? data.from : data.to,
          amount: sign + amount,
          currency: opCurrency,
          memo: memo || null,
          memoIconText: memoIconText || null,
          icon: opCurrency === CURRENCY.GOLOS ? 'logo' : 'brilliant',
          color: isReceive ? CURRENCY_COLOR[opCurrency] : null,
        };
      }
    }
  }

  processRewards(type, data) {
    const { rewardType } = this.state;

    if (rewardType === REWARDS_TYPES.CURATORIAL && type === 'curation_reward') {
      const amount = vestsToGolosEasy(data.reward);

      if (/^0+\.0+$/.test(amount)) {
        return;
      }

      return {
        type: DIRECTION.RECEIVE,
        post: {
          author: data.comment_author,
          permLink: data.comment_permlink,
        },
        amount: `+${amount}`,
        currency: CURRENCY.GOLOS_POWER,
        memo: data.memo || null,
        icon: 'k',
        color: '#f57c02',
      };
    }

    if (rewardType === REWARDS_TYPES.AUTHOR && type === 'author_reward') {
      const currencies = [];

      const golos = data.steem_payout.split(' ')[0];
      const power = vestsToGolosEasy(data.vesting_payout);
      const gold = data.sbd_payout.split(' ')[0];

      addValueIfNotZero(currencies, golos, CURRENCY.GOLOS);
      addValueIfNotZero(currencies, power, CURRENCY.GOLOS_POWER);
      addValueIfNotZero(currencies, gold, CURRENCY.GBG);

      if (!currencies.length) {
        currencies.push({
          amount: '0',
          currency: CURRENCY.GOLOS,
        });
      }

      return {
        type: DIRECTION.RECEIVE,
        post: { author: data.author, permLink: data.permlink },
        currencies,
        memo: data.memo || null,
        icon: 'a',
        color: '#f57c02',
      };
    }

    if (rewardType === REWARDS_TYPES.DELEGATION && type === 'delegation_reward') {
      const amount = vestsToGolosEasy(data.vesting_shares);

      if (/^0+\.0+$/.test(amount)) {
        return;
      }

      return {
        type: DIRECTION.RECEIVE,
        title: data.delegatee,
        amount: `+${amount}`,
        currency: CURRENCY.GOLOS_POWER,
        icon: 'k',
        color: '#f57c02',
      };
    }
  }

  /* onRewardTabChange = ({ id }) => {
    this.setState({
      rewardTab: id,
      limit: DEFAULT_ROWS_LIMIT,
    });
  }; */

  /* onPostClick = async post => {
    const postData = await api.getContentAsync(post.author, post.permLink, 0);
    browserHistory.push(postData.url);
  }; */

  renderLoader = () => (
    <LoaderWrapper>
      <LoadingIndicator type="circle" size={40} />
    </LoaderWrapper>
  );

  renderContent() {
    const { mainTab, delegationData, delegationError } = this.state;

    if (mainTab === MAIN_TABS.POWER) {
      if (delegationError) {
        return <Stub>{tt('user_wallet.content.failed_load')}</Stub>;
      }
      if (!delegationData) {
        return this.renderLoader();
      }
    }

    return this.renderList();
  }

  renderList() {
    const { isOwner, globalProps } = this.props;
    const { mainTab, rewardTab, rewardType } = this.state;

    if (mainTab === MAIN_TABS.REWARDS && rewardTab === REWARDS_TABS.STATISTIC) {
      return <EmptyBlock>{tt('user_wallet.content.feature_not_implemented')}</EmptyBlock>;
    }

    let list;

    if (mainTab === MAIN_TABS.POWER) {
      list = this.makeGolosPowerList();
    } else {
      list = this.makeTransferList();
    }

    if (!list) {
      return this.renderLoader();
    }

    if (list.length) {
      const { loggedUserId, myAccount, getContent, postsContent } = this.props;
      const { delegationData } = this.state;

      return (
        <Lines>
          {list.map((item, i) => (
            <WalletLine
              key={i}
              data={item}
              loggedUserId={loggedUserId}
              myAccount={myAccount}
              delegationData={delegationData}
              globalProps={globalProps}
              delegate={this.props.delegate}
              postsContent={postsContent}
              getContent={getContent}
            />
          ))}
        </Lines>
      );
    }
    if (mainTab === MAIN_TABS.REWARDS) {
      if (rewardType === REWARDS_TYPES.AUTHOR) {
        return (
          <EmptyBlock>
            {tt('user_wallet.content.nothing_here_yet')}
            <EmptySubText>
              {isOwner
                ? tt('user_wallet.content.tip.start_writing')
                : tt('user_wallet.content.tip.user_has_no_posts')}
            </EmptySubText>
          </EmptyBlock>
        );
      }
      return (
        <EmptyBlock>
          {tt('user_wallet.content.nothing_here_yet')}
          <EmptySubText>
            {isOwner
              ? tt('user_wallet.content.tip.start_commenting')
              : tt('user_wallet.content.tip.user_has_no_comments')}
          </EmptySubText>
        </EmptyBlock>
      );
    }

    return <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>;
  }

  render() {
    const { isOwner, userId } = this.props;
    const { mainTab, currency, rewardType, direction } = this.state;

    return (
      <Card auto>
        <Head>
          <title>
            {tt('meta.title.profile.wallet', {
              name: userId,
            })}
          </title>
        </Head>
        {isOwner && userId ? <PowerDownLine userId={userId} /> : null}
        <Header>{tt('g.wallet')}</Header>
        <WalletTabs
          mainTab={mainTab}
          currency={currency}
          rewardType={rewardType}
          direction={direction}
          onMainTabChange={this.onMainTabChange}
          onCurrencyChange={this.onCurrencyChange}
          onRewardTypeChange={this.onRewardTypeChange}
          onDirectionChange={this.onDirectionChange}
        />
        <Content ref={this.contentRef}>{this.renderContent()}</Content>
      </Card>
    );
  }
}
