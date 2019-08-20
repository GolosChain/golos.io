export const FIELD_TYPES = {
  PERCENT: 'PERCENT',
};

export const CONTRACTS = [
  {
    contractName: 'publish',
    structures: [
      {
        name: 'st_max_vote_changes',
        title: 'Максимальное количество смен голоса',
      },
      {
        name: 'st_cashout_window',
        title: 'Окно выплат',
        fields: {
          window: 'Окно (сек)',
          upvote_lockout: 'Upvote Lockout (сек)',
        },
      },
      { name: 'st_max_beneficiaries', title: 'Максимум бенефициаров' },
      {
        name: 'st_max_comment_depth',
        title: 'Вложенность комментариев',
      },
      { name: 'st_social_acc', title: 'Социальный аккаунт' },
      { name: 'st_referral_acc', title: 'Реферальный аккаунт' },
      {
        name: 'st_curators_prcnt',
        title: 'Проценты кураторской выплаты',
        fields: {
          min_curators_prcnt: 'Минимум (%)',
          max_curators_prcnt: 'Максимум (%)',
        },
        fieldsTypes: {
          max_curators_prcnt: FIELD_TYPES.PERCENT,
          min_curators_prcnt: FIELD_TYPES.PERCENT,
        },
      },
      {
        name: 'st_bwprovider',
        title: 'Предоставление bandwidth',
        fields: {
          actor: 'Актор',
          permission: 'Уровень разрешений',
        },
      },
    ],
  },
  {
    contractName: 'ctrl',
    structures: [
      {
        name: 'ctrl_token',
        title: 'Управляющий токен',
      },
      {
        name: 'multisig_acc',
        title: 'Multi-sig аккаунт',
      },
      {
        name: 'multisig_perms',
        title: 'Multi-sig разрешения',
        fields: {
          super_majority: 'Super majority',
          majority: 'Majority',
          minority: 'Minority',
        },
      },
      {
        name: 'max_witnesses',
        title: 'Максимальное количество делегатов',
      },
      {
        name: 'max_witnesses_votes',
        title: 'Максимальное количество голосов за делегатов',
      },
      {
        name: 'update_auth',
        title: 'Период обновления авторизации',
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
      },
      {
        name: 'expire_parametrs',
        title: 'Expire',
      },
      {
        name: 'percent_parametrs',
        title: 'Percent',
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
      },
      {
        name: 'reward_pools',
        title: 'Пул наград',
      },
      {
        name: 'emit_token',
        title: 'Токен эмиссии',
      },
      {
        name: 'emit_interval',
        title: 'Интервал эмиссии',
      },
      {
        name: 'bwprovider',
        title: 'Bandwidth provider',
        fields: {
          actor: 'Актор',
          permission: 'Уровень разрешений',
        },
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
      },
      {
        name: 'vesting_amount',
        title: 'vesting_amount',
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
      },
      {
        name: 'vesting_bwprovider',
        title: 'vesting_bwprovider',
        fields: {
          actor: 'Актор',
          permission: 'Уровень разрешений',
        },
      },
    ],
  },
  {
    contractName: 'charge',
    structures: [
      {
        name: 'setrestorer',
        title: 'restorer',
        fields: {
          token_code: 'Token',
          charge_id: 'Charge Id',
          func_str: 'Func',
          max_prev: 'Max prev',
          max_vesting: 'Max vesting',
          max_elapsed: 'Max elapsed',
        },
      },
    ],
  },
];
