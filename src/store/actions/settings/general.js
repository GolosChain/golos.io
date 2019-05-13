import { updateSettings } from 'store/actions/gate/settings';

export const saveLocale = locale =>
  updateSettings({
    basic: {
      lang: locale,
    },
  });
