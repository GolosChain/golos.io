import { combineReducers } from 'redux';
import { createFlopflipReducer, FLOPFLIP_STATE_SLICE } from '@flopflip/react-redux';
import { modalsReducer as modals } from 'redux-modals-manager';

import defaultFlags from 'shared/feature-flags';

import data from './data';
import entities from './entities';
import status from './status';
import ui from './ui';

export default combineReducers({
  data,
  entities,
  status,
  ui,
  modals,
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(defaultFlags),
});
