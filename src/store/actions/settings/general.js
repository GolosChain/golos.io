import { updateSettings } from 'store/actions/gate/settings';

// eslint-disable-next-line import/prefer-default-export
export const saveLocale = locale =>
  updateSettings({
    basic: {
      lang: locale,
    },
  });
