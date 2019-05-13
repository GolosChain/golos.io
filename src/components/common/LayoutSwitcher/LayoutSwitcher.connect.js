import { connect } from 'react-redux';

import { setLayout } from 'store/actions/ui/mode';
import { UIModeSelector } from 'store/selectors/ui';

import LayoutSwitcher from './LayoutSwitcher';

export default connect(
  state => ({
    layout: UIModeSelector('layout')(state),
  }),
  {
    setLayout,
  }
)(LayoutSwitcher);
