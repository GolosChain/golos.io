import { connect } from 'react-redux';

import Follow from './Follow';

export default connect(
  () => ({
    username: 'who-is-it',
  }),
  {
    updateFollow: () => () => console.error('Unhandled action'),
  }
)(Follow);
