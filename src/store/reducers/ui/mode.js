import { DEFAULT_LOCALE } from 'constants/config';
import { UPDATE_UI_MODE } from 'store/constants/actionTypes';
import { CHANGE_LOCALE } from 'store/constants';

const initialState = {
  screenType: 'mobile',
  layout: 'list',
  isSSR: true,
  locale: DEFAULT_LOCALE,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_UI_MODE:
      return {
        ...state,
        ...payload,
      };

    case CHANGE_LOCALE:
      return {
        ...state,
        locale: payload.locale,
      };

    default:
      return state;
  }
}
