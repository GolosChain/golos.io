import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import CardAuthor from './CardAuthor';

export default connect((state, props) => {
  let author = props.author;

  if (!author) {
    author = entitySelector('users', props.authorId)(state);
  }

  const profile = entitySelector('profiles', author.id)(state);

  return {
    author,
    profile,
  };
})(CardAuthor);
