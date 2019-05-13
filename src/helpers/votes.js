import tt from 'counterpart';
import DialogManager from 'components/elements/common/DialogManager';

export async function confirmVote(votes, percent) {
  if (votes) {
    let action;

    if (votes.hasUpVote) {
      if (percent === 0) {
        action = tt('voting_jsx.removing_your_vote');
      } else if (percent < 0) {
        action = tt('voting_jsx.changing_to_a_downvote');
      }
    } else if (votes.hasDownVote) {
      if (percent > 0) {
        action = tt('voting_jsx.changing_to_an_upvote');
      }
    }

    if (action) {
      if (
        !(await DialogManager.confirm(
          action + tt('voting_jsx.we_will_reset_curation_rewards_for_this_post')
        ))
      ) {
        return false;
      }
    }
  }

  return true;
}
