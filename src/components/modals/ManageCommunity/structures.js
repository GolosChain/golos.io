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

import SetRestorer from './structures/charge/SetRestorer';

export const STRUCTURES = {
  publish: {
    st_max_vote_changes: MaxVoteChanges,
    st_cashout_window: CashoutWindow,
    st_max_beneficiaries: MaxBeneficiaries,
    st_max_comment_depth: MaxCommentDepth,
    st_social_acc: SocialAcc,
    st_referral_acc: ReferralAcc,
    st_curators_prcnt: CuratorPercent,
    st_bwprovider: BwProvider,
  },
  ctrl: {
    ctrl_token: CtrlToken,
    multisig_acc: MultisigAcc,
    multisig_perms: MultisigPerms,
    max_witnesses: MaxWitnesses,
    max_witnesses_votes: MaxWitnessesVotes,
    update_auth: UpdateAuth,
  },
  referral: {
    breakout_parametrs: BreakoutParams,
    expire_parametrs: ExpireParams,
    percent_parametrs: PercentParams,
  },
  emit: {
    inflation_rate: InflationRate,
    reward_pools: RewardsPool,
    emit_token: EmitToken,
    emit_interval: EmitInterval,
    bwprovider: BwProvider,
  },
  vesting: {
    vesting_withdraw: VestingWithdraw,
    vesting_amount: VestingAmount,
    vesting_delegation: VestingDelegation,
    vesting_bwprovider: BwProvider,
  },
  charge: {
    setrestorer: SetRestorer,
  },
};
