import { dataSelector } from './common';

export const currentLocaleSelector = dataSelector(['settings', 'basic', 'lang']);
export const nsfwTypeSelector = dataSelector(['settings', 'basic', 'nsfw']);
export const selfVoteSelector = dataSelector(['settings', 'basic', 'selfVote']);
