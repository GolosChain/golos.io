export const FIELD_TYPES = {
  PERCENT: 'PERCENT',
  INTEGER_VESTING: 'INTEGER_VESTING',
};

export const CONTRACTS = [
  {
    contractName: 'publish',
    link:
      'https://cyberway.gitbook.io/ru/v/master-ru/developers/golos_contracts/golos.publication_contract#operaciya-deistvie-setparams',
    actions: [
      {
        name: 'setparams',
        structures: [
          {
            name: 'st_max_vote_changes',
            title: 'Максимальное количество смен голоса за пост (от 0 до 255)',
            defaults: {
              value: 5,
            },
          },
          {
            name: 'st_cashout_window',
            title: 'Окно выплат за пост',
            fields: {
              window: 'Окно (сек)',
              upvote_lockout: 'Длительность запрета на смену голоса (сек)',
            },
            limits: {
              window: '(от 0 до 4 млрд)',
              upvote_lockout: '(не может быть больше окна выплат)',
            },
            defaults: {
              window: 604800,
              upvote_lockout: 60,
            },
          },
          {
            name: 'st_max_beneficiaries',
            title: 'Максимум бенефициаров-авторов поста (от 0 до 255)',
            defaults: {
              value: 64,
            },
          },
          {
            name: 'st_max_comment_depth',
            title: 'Вложенность комментариев (от 1 до 65535)',
            defaults: {
              value: 127,
            },
          },
          // { name: 'st_social_acc', title: 'Социальный аккаунт' },
          // { name: 'st_referral_acc', title: 'Реферальный аккаунт' },
          {
            name: 'st_curators_prcnt',
            title: 'Проценты кураторской выплаты',
            fields: {
              min_curators_prcnt: 'Минимум (%)',
              max_curators_prcnt: 'Максимум (%)',
            },
            defaults: {
              min_curators_prcnt: 5000,
              max_curators_prcnt: 10000,
            },
            fieldsTypes: {
              max_curators_prcnt: FIELD_TYPES.PERCENT,
              min_curators_prcnt: FIELD_TYPES.PERCENT,
            },
          },
          // {
          //   name: 'st_bwprovider',
          //   title: 'Предоставление bandwidth',
          //   fields: {
          //     actor: 'Актор',
          //     permission: 'Уровень разрешений',
          //   },
          // },
          {
            name: 'st_min_abs_rshares',
            title:
              'Минимальное значение rshares, позволяющее аккаунтам голосовать (от 0 до 18 триллион)',
            defaults: {
              value: 30000000,
            },
            fieldsTypes: {
              value: FIELD_TYPES.INTEGER_VESTING,
            },
          },
        ],
      },
      {
        name: 'setrules',
        description: 'Параметры пула вознаграждения',
        fields: {
          mainfunc:
            'Функция, вычисляющая суммарное значение вознаграждения для автора и кураторов поста',
          curationfunc: 'Функция, вычисляющая значение вознаграждения для каждого из кураторов',
          timepenalty:
            'Функция, вычисляющая вес голоса с учетом времени голосования и длительности штрафного окна',
          maxtokenprop:
            'Максимальная доля награды, выплачиваемая в токене (остаток в вестинге), которое может получить автор (%)',
          tokensymbol: '',
        },
        limits: {
          mainfunc: '(функция должна быть монотонна и неотрицательна)',
          curationfunc: '(функция должна быть монотонна и неотрицательна)',
          maxtokenprop: '(от 0 до 100)',
        },
        defaults: {
          mainfunc: {
            str: 'x',
            maxarg: '2251799813685247',
          },
          curationfunc: {
            str: 'x',
            maxarg: '2251799813685247',
          },
          timepenalty: {
            str: '1',
            maxarg: '1',
          },
          maxtokenprop: '5000',
          tokensymbol: 'GOLOS',
        },
        fieldsTypes: {
          maxtokenprop: FIELD_TYPES.PERCENT,
        },
      },
    ],
  },
  {
    contractName: 'ctrl',
    link:
      'https://cyberway.gitbook.io/ru/v/master-ru/developers/golos_contracts/golos.ctrl_contract#operaciya-deistvie-setparams',
    actions: [
      {
        name: 'setparams',
        structures: [
          // {
          //   name: 'ctrl_token',
          //   title: 'Управляющий токен',
          // },
          // {
          //   name: 'multisig_acc',
          //   title: 'Multi-sig аккаунт',
          // },
          // {
          //   name: 'multisig_perms',
          //   title: 'Multi-sig разрешения',
          //   fields: {
          //     super_majority: 'Super majority',
          //     majority: 'Majority',
          //     minority: 'Minority',
          //   },
          // },
          {
            name: 'max_witnesses',
            title: 'Максимальное количество лидеров (от 1 до 65535)',
            defaults: {
              max: 21,
            },
          },
          {
            name: 'max_witnesses_votes',
            disabled: true,
            title:
              'Максимальное количество голосов за делегатов (от 1 до 65535) (изменение данного значения потребует изменение контракта ctrl)',
            defaults: {
              max: 30,
            },
          },
          // {
          //   name: 'update_auth',
          //   title: 'Период обновления авторизации',
          //   defaults: {
          //     value: 300,
          //   },
          // },
        ],
      },
    ],
  },
  // {
  //   contractName: 'referral',
  //   link:
  //     'https://cyberway.gitbook.io/ru/v/master-ru/developers/golos_contracts/golos.referral_contract#operaciya-deistvie-setparams',
  //   actions: [
  //     {
  //       name: 'setparams',
  //       structures: [
  //         {
  //           name: 'breakout_parametrs',
  //           title: 'Breakout',
  //           fields: {
  //             min_breakout: 'Минимум',
  //             max_breakout: 'Максимум',
  //           },
  //         },
  //         {
  //           name: 'expire_parametrs',
  //           title: 'Expire',
  //         },
  //         {
  //           name: 'percent_parametrs',
  //           title: 'Percent',
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    contractName: 'emit',
    link:
      'https://cyberway.gitbook.io/ru/v/master-ru/developers/golos_contracts/golos.emit_contract#operaciya-deistvie-setparams',
    actions: [
      {
        name: 'setparams',
        structures: [
          {
            name: 'inflation_rate',
            title: 'Параметры инфляции',
            fields: {
              start: 'Верхний уровень (%)',
              stop: 'Нижний уровень (%)',
              narrowing: 'Скорость уменьшения % инфляции, (сек для уменьшения на 0.01%)',
            },
            limits: {
              start: '(от 0 до 655.35%)',
              stop: '(от 0 до 655.35%)',
              narrowing: '(от‌ ‌0‌ ‌до‌ ‌4 млрд‌)',
            },
            defaults: {
              start: '1399',
              stop: '95',
              narrowing: '250000',
            },
            fieldsTypes: {
              start: FIELD_TYPES.PERCENT,
              stop: FIELD_TYPES.PERCENT,
            },
          },
          {
            name: 'reward_pools',
            title:
              'Пулы вознаграждений (значение 0 означает что в этот пул будет идти весь остаток до 100%)',
            proposalTitle: 'Пулы вознаграждений',
            defaults: {
              pools: [
                {
                  name: 'gls.ctrl',
                  percent: '0',
                },
                {
                  name: 'gls.publish',
                  percent: '6667',
                },
                {
                  name: 'gls.vesting',
                  percent: '2667',
                },
                // {
                //   name: 'gls.worker',
                //   percent: '0',
                // },
              ],
            },
          },
          // {
          //   name: 'emit_token',
          //   title: 'Токен эмиссии',
          // },
          {
            name: 'emit_interval',
            title: 'Интервал эмиссии (сек) (от 1 до 65535)',
            defaults: {
              value: 900,
            },
          },
          // {
          //   name: 'bwprovider',
          //   title: 'Bandwidth provider',
          //   fields: {
          //     actor: 'Актор',
          //     permission: 'Уровень разрешений',
          //   },
          // },
        ],
      },
    ],
  },
  {
    contractName: 'vesting',
    link:
      'https://cyberway.gitbook.io/ru/v/master-ru/developers/golos_contracts/golos.vesting_contract#operaciya-deistvie-setparams',
    actions: [
      {
        name: 'setparams',
        actor: 'gls',
        structures: [
          {
            name: 'vesting_withdraw',
            title: 'Параметры вывода вестинга в ликвидные токены',
            fields: {
              intervals: 'Количество интервалов (шт)',
              interval_seconds: 'Время интервала (сек)',
            },
            limits: {
              intervals: '(от 1 до 255)',
              interval_seconds: '(от 1 до 4 млрд)',
            },
            defaults: {
              intervals: 13,
              interval_seconds: 604800,
            },
          },
          {
            name: 'vesting_amount',
            title: 'Минимальное значение вестинга для вывода в ликвидные токены',
            limits: {
              min_amount: '(от 0 до 18 триллион)',
            },
            fieldsTypes: {
              min_amount: FIELD_TYPES.INTEGER_VESTING,
            },
            defaults: {
              min_amount: 10500000000,
            },
          },
          {
            name: 'vesting_delegation',
            title: 'Параметры делегирования вестинга',
            fields: {
              min_amount:
                'Минимально допустимое количество вестинга для делегирования/возврата делегированного (вестинг)',
              min_remainder: 'Минимальный остаток делегированного (вестинг)',
              return_time: 'Время возврата делегированных средств (сек)',
              min_time: 'Минимальная длительность делегирования (сек)',
              max_delegators:
                'Максимальное количество пользователей, от которых можно получить вестинг',
            },
            limits: {
              min_amount: '(от 0 до 10^16)',
              min_remainder: '(от 0 до 10^16)',
              return_time: '(от 0 до 4 млрд)',
              min_time: '(от 0 до 4 млрд)',
              max_delegators: '(от 0 до 4 млрд)',
            },
            defaults: {
              min_amount: 3500,
              min_remainder: 3500,
              return_time: 604800,
              min_time: 0,
              max_delegators: 32,
            },
          },
          // {
          //   name: 'vesting_bwprovider',
          //   title: 'vesting_bwprovider',
          //   fields: {
          //     actor: 'Актор',
          //     permission: 'Уровень разрешений',
          //   },
          // },
        ],
      },
    ],
  },
  {
    contractName: 'charge',
    link:
      'https://cyberway.gitbook.io/ru/v/master-ru/developers/golos_contracts/golos.charge_contract#operaciya-deistvie-setrestorer',
    actions: [
      {
        name: 'setrestorer',
        description:
          'Операция-действие setrestorer используется для задания алгоритма, по которому происходит восстановление ресурса батарейки.',
        fields: {
          charge_id: 'Charge Id',
          func_str: 'Func',
          max_prev: 'Max prev',
          max_vesting: 'Max vesting',
          max_elapsed: 'Max elapsed',
        },
        limits: {
          max_prev: '(от 0 до 2*10^15)',
          max_vesting: '(от 0 до 2*10^15)',
          max_elapsed: '(от 0 до 2*10^15)',
        },
        defaults: {
          token_code: 'GOLOS',
          charge_id: 0,
          func_str: 't*p/86400',
          max_prev: '0',
          max_vesting: '0',
          max_elapsed: '0',
        },
      },
    ],
  },
];
