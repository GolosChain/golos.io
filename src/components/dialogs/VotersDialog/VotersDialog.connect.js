import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { getVoters } from 'app/redux/actions/vote';
import { compareActiveVotes } from 'utils/StateFunctions';
import { currentUsernameSelector } from 'store/selectors/auth';

import VotersDialog from 'components/dialogs/VotersDialog/VotersDialog';

const MAX_VOTE_PERCENT = 10000;

export default connect(
  createSelector(
    [
      uiSelector('votersDialog'),
      globalSelector('content'),
      globalSelector('accounts'),
      (state, props) => props.postLink,
      (state, props) => props.isLikes,
      currentUsernameSelector,
    ],
    (votersDialog, content, accounts, postLink, isLikes, username) => {
      const post = content.get(postLink);
      if (!post) {
        return {
          loading: false,
          users: [],
          hasMore: false,
          username,
        };
      }

      const voters = post.get('active_voters', []);
      const users = voters
        .filter(voter => {
          const percent = voter.get('percent');
          return (percent > 0 && isLikes) || (percent < 0 && !isLikes);
        })
        .sort(compareActiveVotes)
        .map(voter => {
          const name = voter.get('voter');
          const percent = Math.abs((voter.get('percent') / MAX_VOTE_PERCENT) * 100);
          const jsonMetadata = accounts.getIn([name, 'json_metadata'], '{}');
          let avatar;
          try {
            const profile = JSON.parse(jsonMetadata).profile || {};
            avatar = profile.profile_image;
          } catch (error) {
            console.error("Can't parse string to JS: %s", jsonMetadata);
          }

          return {
            name,
            avatar,
            percent,
          };
        });

      return {
        loading: votersDialog.get('loading'),
        users,
        hasMore: voters.length < post.get('active_votes_count'),
        username,
      };
    }
  ),
  {
    getVoters,
  }
)(VotersDialog);
