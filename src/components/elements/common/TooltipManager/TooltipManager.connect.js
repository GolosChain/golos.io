import { connect } from 'react-redux';

import { isSSRSelector } from 'store/selectors/ui';

import TooltipManager from './TooltipManager';

export default connect(state => ({
  isSSR: isSSRSelector(state),
}))(TooltipManager);
