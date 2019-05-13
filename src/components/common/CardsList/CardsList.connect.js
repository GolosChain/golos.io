import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';
// import { saveListScrollPosition } from 'app/redux/actions/ui';
// import { locationSelector } from 'app/redux/selectors/app/location';

import CardsList from './CardsList';

// const ignoreResultSelector = createDeepEqualSelector(
//     [globalSelector('follow'), currentUsernameSelector],
//     (follow, currentUsername) =>
//         follow && follow.getIn(['getFollowingAsync', currentUsername, 'ignore_result'])
// );

export default connect(
  // createDeepEqualSelector(
  //     [locationSelector, uiSelector('common'), ignoreResultSelector],
  //     (location, uiCommon, ignoreResult) => ({
  //         location,
  //         listScrollPosition: uiCommon.get('listScrollPosition'),
  //         backClickTs: uiCommon.get('backClickTs'),
  //         ignoreResult,
  //     })
  // ),
  state => ({
    layout: UIModeSelector('layout')(state),
    location: null,
    listScrollPosition: null,
    backClickTs: null,
    ignoreResult: null,
  }),
  {
    saveListScrollPosition: () => () => {
      // eslint-disable-next-line no-console
      console.error('Unhandled action');
    },
  }
)(CardsList);
