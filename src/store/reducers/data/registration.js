import {
  SET_SCREEN_ID,
  SET_PHONE_NUMBER,
  SET_LOCATION_DATA,
  SET_WISH_USERNAME,
  CLEAR_REGISTRATION_DATA,
  SET_FULL_PHONE_NUMBER,
  SET_USERS_KEYS,
  SET_LOCAL_STORAGE_DATA,
} from 'store/constants';

const initialState = {
  screenId: '',
  locationData: {
    code: '',
    country: '',
    countryCode: '',
  },
  fullPhoneNumber: '',
  phoneNumber: '',
  wishUsername: '',
  keys: {},
};

export default function(state = initialState, { type, payload = {} }) {
  switch (type) {
    case SET_SCREEN_ID:
      return {
        ...state,
        screenId: payload.id,
      };

    case SET_PHONE_NUMBER:
      return {
        ...state,
        phoneNumber: payload.phoneNumber,
      };

    case SET_FULL_PHONE_NUMBER:
      return {
        ...state,
        fullPhoneNumber: payload.fullPhoneNumber,
      };

    case SET_LOCATION_DATA:
      return {
        ...state,
        locationData: payload.locationData,
      };

    case SET_WISH_USERNAME:
      return {
        ...state,
        wishUsername: payload.wishUsername,
      };

    case SET_USERS_KEYS:
      return {
        ...state,
        keys: payload.keys,
      };

    case SET_LOCAL_STORAGE_DATA:
      return {
        ...state,
        ...payload.data,
      };

    case CLEAR_REGISTRATION_DATA:
      return initialState;

    default:
      return state;
  }
}
