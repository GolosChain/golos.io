import MaxVoteChanges from './structures/MaxVoteChanges';
import CashoutWindow from './structures/CashoutWindow';
import MaxBeneficiaries from './structures/MaxBeneficiaries';
import MaxCommentDepth from './structures/MaxCommentDepth';
import SocialAcc from './structures/SocialAcc';
import ReferralAcc from './structures/ReferralAcc';
import CuratorPercent from './structures/CuratorPercent';
import BwProvider from './structures/BwProvider';

export const CONTRACTS = [
  {
    contractName: 'publish',
    structures: [
      {
        name: 'st_max_vote_changes',
        title: 'Максимальное количество смен голоса',
        Component: MaxVoteChanges,
      },
      { name: 'st_cashout_window', title: 'Окно выплат', Component: CashoutWindow },
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
        Component: CuratorPercent,
      },
      { name: 'st_bwprovider', title: 'Предоставление bandwidth', Component: BwProvider },
    ],
  },
];
