import { dataSelector } from './common';

export const regDataSelector = dataSelector('registration');

export const fullNumberSelector = dataSelector(['registration', 'fullPhoneNumber']);
