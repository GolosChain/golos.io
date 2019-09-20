import { createSelector } from 'reselect';
import { path } from 'ramda';

import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import { dataSelector } from './common';

export const golosSupplySelector = dataSelector(['wallet', 'globalSupply', 'golos']);

export const userWalletSelector = (userId, fields) => {
  let fullPath = ['wallet', 'users', userId];

  if (fields) {
    if (Array.isArray(fields)) {
      fullPath.push(...fields);
    } else {
      fullPath.push(fields);
    }
  }

  return dataSelector(fullPath);
};

export const userBalanceSelector = userId => dataSelector(['wallet', 'users', userId, 'balances']);

export const userLiquidBalanceSelector = (userId, symbol = 'GOLOS') =>
  createSelector(
    [userBalanceSelector(userId)],
    balances => parsePayoutAmount(path(['liquid', 'balances', symbol], balances)) || 0
  );

export const userLiquidUnclaimedBalanceSelector = userId =>
  createSelector(
    [userBalanceSelector(userId)],
    balances => parsePayoutAmount(balances?.liquid?.payments?.GOLOS) || 0
  );

export const userCyberStakeBalanceSelector = (userId, type) =>
  createSelector(
    [userBalanceSelector(userId)],
    balances => parsePayoutAmount(path(['stakeInfo', type], balances)) || 0
  );

export const userVestingBalanceSelector = (userId, symbol = 'GOLOS') =>
  createSelector(
    [userBalanceSelector(userId)],
    balances => ({
      total: parsePayoutAmount(path(['vesting', 'total', symbol], balances)) || 0,
      outDelegate: parsePayoutAmount(path(['vesting', 'outDelegate', symbol], balances)) || 0,
      inDelegated: parsePayoutAmount(path(['vesting', 'inDelegated', symbol], balances)) || 0,
    })
  );

export const userWithdrawStatusSelector = userId =>
  createSelector(
    [userBalanceSelector(userId)],
    status => ({
      toWithdraw: path(['vesting', 'withdraw', 'toWithdraw'], status) || 0,
      quantity: path(['vesting', 'withdraw', 'quantity'], status),
      nextPayout: path(['vesting', 'withdraw', 'nextPayout'], status),
    })
  );
