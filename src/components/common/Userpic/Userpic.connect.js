import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import Userpic from './Userpic';

export default connect((state, props) => ({
  avatarUrl: entitySelector('users', props.userId)(state)?.avatarUrl,
}))(Userpic);
