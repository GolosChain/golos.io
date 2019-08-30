import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';

import TooltipManager from './TooltipManager';

export default connect(state => ({
  isSSR: UIModeSelector('isSSR')(state),
}))(TooltipManager);
