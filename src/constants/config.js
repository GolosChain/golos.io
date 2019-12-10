// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'Голос';
export const APP_NAME_LATIN = 'Golos';
export const APP_NAME_UP = 'GOLOS.io';
export const APP_ICON = 'golos';
export const APP_DOMAIN = 'golos.io';
export const APP_URL = 'https://golos.io';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'GOLOS';

// application settings
export const DEFAULT_LOCALE = 'ru';
export const LOCALE_COOKIE_KEY = 'golos.locale';
export const LOCALE_COOKIE_EXPIRES = new Date(Date.now() + 315360000000); // 10 years
export const LANGUAGES = {
  ru: {
    value: 'Русский',
    shortValue: 'RU',
  },
  en: {
    value: 'English',
    shortValue: 'EN',
  },
  /* in react-intl they use 'uk' instead of 'ua' */
  uk: {
    value: 'Українська',
    shortValue: 'UA',
  },
};
// First element always is USD, it needs to be correct fetch yahoo exchange rates from server side
export const CURRENCIES = ['USD', 'RUB', 'EUR', LIQUID_TICKER];
export const DEFAULT_CURRENCY = 'RUB';

// meta info
// export const TWITTER_HANDLE = '@goloschain';
// export const SHARE_IMAGE = `https://${APP_DOMAIN}/images/golos-share.png`;
// export const TWITTER_SHARE_IMAGE = `https://${APP_DOMAIN}/images/golos-twshare.png`;
// export const SITE_DESCRIPTION =
//   'Голос - социальная сеть, построенная на публичном блокчейне. Вознаграждение пользователей осуществляется за счет дополнительной эмиссии токенов. При этом распределением токенов управляют текущие пользователи сети через голосование за лучший контент.';

// registration
export const REGISTRATION_URL = 'https://reg.golos.io/';

// various
export const SUPPORT_EMAIL = `support@${APP_DOMAIN}`;
export const SUPPORT_EMAIL_2 = 'pr@golos.io';
// ignore special tags, dev-tags, partners tags
export const IGNORE_TAGS = ['bm-open', 'bm-ceh23', 'bm-tasks', 'bm-taskceh1'];

export const USER_GENDER = ['undefined', 'male', 'female'];

export const ANDROID_PACKAGE = 'io.golos.golos';
export const ANDROID_DEEP_LINK_DOMAIN = 'golos.io';
export const TERMS_OF_SERVICE_URL = 'https://golos.io/legal/terms_of_service.pdf';
export const GOLOS_EXPLORER = 'https://explorer.golos.io';
export const WIKI_URL = 'https://wiki.golos.io/';

export const MIN_VOICE_POWER = 3;

export const LEAVE_PAGE_WHITELIST_DOMAINS = [
  'golos.io',
  'golos.blog',
  'golostools.com',
  'github.com',
  'play.google.com',
  'tlg.name',
  'facebook.com',
  'vk.com',
  'instagram.com',
  'twitter.com',
  'explorer.golos.io',
  'kuna.com.ua',
  'forklog.com',
  'steepshot.io',
  'goldvoice.club',
  'golos.today',
  'cpeda.space',
  'linkedin.com',
];

export const DONATION_FOR = 'Donation for';

export const AMPLITUDE_SESSION = 'amplitudeSession';

export const AUCTION_REWARD_DESTINATION = {
  DEFAULT: 'to_curators',
  DESTINATION: {
    to_reward_fund: 0,
    to_curators: 1,
  },
};

export const imgHostingUrl = process.env.IMAGE_HOSTING_URL;
export const imgProxyPrefix = `${process.env.IMAGE_HOSTING_URL}/proxy`;
export const NSFW_IMAGE_URL = '/images/nsfw/nsfw.svg';

export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const RECAPTCHA_KEY = '6LcZBscUAAAAAGgTHMV8kwKPc_Cw1_lGHjmXsX2s';
