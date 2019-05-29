import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';

import CardAuthor from './CardAuthor';

export default connect(
  createStructuredSelector({
    profile: (state, props) => entitySelector('profiles', props.author.id)(state),
  })
)(CardAuthor);
