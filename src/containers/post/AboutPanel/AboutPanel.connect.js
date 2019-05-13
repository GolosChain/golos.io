import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'store/selectors/auth';
import { profileSelector } from 'store/selectors/common';

import AboutPanel from './AboutPanel';

export default connect(
  // createSelector(
  //   [authorSelector, currentPostSelector],
  //   (author, post) => {
  //     // set account join date
  //     const transferFromSteemToGolosDate = '2016-09-29T12:00:00';
  //     let { created } = author;
  //
  //     if (created && new Date(created) < new Date(transferFromSteemToGolosDate)) {
  //       created = transferFromSteemToGolosDate;
  //     }
  //
  //     return {
  //       name: author.name,
  //       account: author.account,
  //       about: author.about,
  //       url: post.url,
  //       created,
  //     };
  //   }
  // ),
  (state, { post }) => {
    const currentUsername = currentUsernameSelector(state);

    return {
      currentUsername,
      profile: profileSelector(post.author)(state),
    };
  },
  {}
)(AboutPanel);
