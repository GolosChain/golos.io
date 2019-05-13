import { UPDATE_UI_MODE } from 'store/constants/actionTypes';

export const updateUIMode = payload => ({
  type: UPDATE_UI_MODE,
  payload,
});

// Set store's variables in 'ui.mode' by analyzing useragent header.
// (Uses only for SSR)
export const setScreenTypeByUserAgent = useragent => {
  if (/ipad/i.test(useragent)) {
    return updateUIMode({ screenType: 'tablet' });
  }

  if (!/iphone|android/i.test(useragent)) {
    return updateUIMode({ screenType: 'desktop' });
  }

  return null;
};

export const setLayoutByCookies = cookies => {
  const layout = cookies['golos.layout'];

  if (layout) {
    return setLayout(layout);
  }

  return null;
};

export const setLayout = layout => {
  if (process.browser) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 20);
    document.cookie = `golos.layout=${layout}; path=/; expires=${date.toGMTString()}`;
  }

  return updateUIMode({ layout });
};
