import MaxVoteChanges from './structures/publish/MaxVoteChanges';
import CashoutWindow from './structures/publish/CashoutWindow';
import MaxBeneficiaries from './structures/publish/MaxBeneficiaries';
import MaxCommentDepth from './structures/publish/MaxCommentDepth';
import SocialAcc from './structures/publish/SocialAcc';
import ReferralAcc from './structures/publish/ReferralAcc';
import CuratorPercent from './structures/publish/CuratorPercent';
import BwProvider from './structures/publish/BwProvider';

import CtrlToken from './structures/ctrl/CtrlToken';
import MultisigAcc from './structures/ctrl/MultisigAcc';
import MultisigPerms from './structures/ctrl/MultisigPerms';
import MaxWitnesses from './structures/ctrl/MaxWitnesses';
import MaxWitnessesVotes from './structures/ctrl/MaxWitnessesVotes';
import UpdateAuth from './structures/ctrl/UpdateAuth';

import BreakoutParams from './structures/referral/BreakoutParams';
import ExpireParams from './structures/referral/ExpireParams';
import PercentParams from './structures/referral/PercentParams';

import InflationRate from './structures/emit/InflationRate';
import RewardsPool from './structures/emit/RewardsPool';
import EmitToken from './structures/emit/EmitToken';
import EmitInterval from './structures/emit/EmitInterval';

import VestingWithdraw from './structures/vesting/VestingWithdraw';
import VestingAmount from './structures/vesting/VestingAmount';
import VestingDelegation from './structures/vesting/VestingDelegation';

export const CONTRACTS = [
  {
    contractName: 'publish',
    structures: [
      {
        name: 'st_max_vote_changes',
        title: 'Максимальное количество смен голоса',
        Component: MaxVoteChanges,
      },
      {
        name: 'st_cashout_window',
        title: 'Окно выплат',
        fields: {
          window: 'Окно (сек)',
          upvote_lockout: 'Upvote Lockout (сек)',
        },
        Component: CashoutWindow,
      },
      { name: 'st_max_beneficiaries', title: 'Максимум бенефициаров', Component: MaxBeneficiaries },
      {
        name: 'st_max_comment_depth',
        title: 'Вложенность комментариев',
        Component: MaxCommentDepth,
      },
      { name: 'st_social_acc', title: 'Социальный аккаунт', Component: SocialAcc },
      { name: 'st_referral_acc', title: 'Реферальный аккаунт', Component: ReferralAcc },
      {
        name: 'st_curators_prcnt',
        title: 'Проценты кураторской выплаты',
        fields: {
          min_curators_prcnt: 'Минимум (%)',
          max_curators_prcnt: 'Максимум (%)',
        },
        Component: CuratorPercent,
      },
      {
        name: 'st_bwprovider',
        title: 'Предоставление bandwidth',
        fields: {
          actor: 'Актор',
          permission: 'Уровень разрешений',
        },
        Component: BwProvider,
      },
    ],
  },
  {
    contractName: 'ctrl',
    structures: [
      {
        name: 'ctrl_token',
        title: 'Управляющий токен',
        Component: CtrlToken,
      },
      {
        name: 'multisig_acc',
        title: 'Multi-sig аккаунт',
        Component: MultisigAcc,
      },
      {
        name: 'multisig_perms',
        title: 'Multi-sig разрешения',
        fields: {
          super_majority: 'Super majority',
          majority: 'Majority',
          minority: 'Minority',
        },
        Component: MultisigPerms,
      },
      {
        name: 'max_witnesses',
        title: 'Максимальное количество делегатов',
        Component: MaxWitnesses,
      },
      {
        name: 'max_witnesses_votes',
        title: 'Максимальное количество голосов за делегатов',
        Component: MaxWitnessesVotes,
      },
      {
        name: 'update_auth',
        title: 'Период обновления авторизации',
        Component: UpdateAuth,
      },
    ],
  },
  {
    contractName: 'referral',
    structures: [
      {
        name: 'breakout_parametrs',
        title: 'Breakout',
        fields: {
          min_breakout: 'Минимум',
          max_breakout: 'Максимум',
        },
        Component: BreakoutParams,
      },
      {
        name: 'expire_parametrs',
        title: 'Expire',
        Component: ExpireParams,
      },
      {
        name: 'percent_parametrs',
        title: 'Percent',
        Component: PercentParams,
      },
    ],
  },
  {
    contractName: 'emit',
    structures: [
      {
        name: 'inflation_rate',
        title: 'Инфляция',
        fields: {
          start: 'Start',
          stop: 'Stop',
          narrowing: 'Narrowing',
        },
        Component: InflationRate,
      },
      {
        name: 'reward_pools',
        title: 'Пул наград',
        Component: RewardsPool,
      },
      {
        name: 'emit_token',
        title: 'Токен эмиссии',
        Component: EmitToken,
      },
      {
        name: 'emit_interval',
        title: 'Интервал эмиссии',
        Component: EmitInterval,
      },
      {
        name: 'bwprovider',
        title: 'Bandwidth provider',
        fields: {
          actor: 'Актор',
          permission: 'Уровень разрешений',
        },
        Component: BwProvider,
      },
    ],
  },
  {
    contractName: 'vesting',
    structures: [
      {
        name: 'vesting_withdraw',
        title: 'vesting_withdraw',
        fields: {
          intervals: 'Количество интервалов',
          interval_seconds: 'Время интервала (сек)',
        },
        Component: VestingWithdraw,
      },
      {
        name: 'vesting_amount',
        title: 'vesting_amount',
        Component: VestingAmount,
      },
      {
        name: 'vesting_delegation',
        title: 'vesting_delegation',
        fields: {
          min_amount: 'Min amount',
          min_remainder: 'Min remainder',
          return_time: 'Return time',
          min_time: 'Min time',
          max_delegators: 'Max delegators',
        },
        Component: VestingDelegation,
      },
      {
        name: 'vesting_bwprovider',
        title: 'vesting_bwprovider',
        fields: {
          actor: 'Актор',
          permission: 'Уровень разрешений',
        },
        Component: BwProvider,
      },
    ],
  },
];
