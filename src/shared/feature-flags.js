// HEADER
export const HEADER_SEARCH = 'headerSearch';
export const HEADER_SIGN_IN = 'headerSignIn';
export const HEADER_SIGN_UP = 'headerSignUp';
export const HEADER_CREATE_POST = 'headerCreatePost';

// PROFILE
export const RIGHTACTIONS_BUY_OR_SELL = 'rightActionsBuyOrSell';
export const RIGHTACTIONS_DELEGATE = 'rightActionsDelegate';

// FOOTER
export const FOOTER_PAYOUT = 'footerPayout';

// SETTINGS
export const USER_SETTINGS = 'userSettings';

// PROPOSALS
export const PROPOSALS_MANAGE_BUTTON = 'proposalsManageButton';

let envFeatureFlags = {};

if (process.env.FEATURE_FLAGS) {
  try {
    envFeatureFlags = JSON.parse(process.env.FEATURE_FLAGS);
  } catch {
    console.error('Wrong JSON of FEATURE_FLAGS');
  }
}

export default {
  // HEADER
  [HEADER_SEARCH]: false,
  [HEADER_SIGN_IN]: true,
  [HEADER_SIGN_UP]: true,
  [HEADER_CREATE_POST]: false,

  // PROFILE
  [RIGHTACTIONS_BUY_OR_SELL]: false,
  [RIGHTACTIONS_DELEGATE]: false,
  [USER_SETTINGS]: false,

  // FOOTER
  [FOOTER_PAYOUT]: false,

  // PROPOSALS
  [PROPOSALS_MANAGE_BUTTON]: false,

  ...envFeatureFlags,
};
