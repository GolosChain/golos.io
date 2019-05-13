import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { getUserStatus } from 'helpers/users';

import UserStatus from './UserStatus';

// const selector = createSelector(
//     [
//         (state, props) => {
//             const account =
//                 props.currentAccount instanceof Map
//                     ? props.currentAccount.name
//                     : props.currentAccount;
//             return globalSelector(['accounts', account])(state);
//         },
//     ],
//     user => {
//         if (!user) {
//             return {};
//         }
//
//         const power = parseFloat(user.get('vesting_shares')).toFixed(3);
//         return {
//             userStatus: getUserStatus(power),
//             power,
//         };
//     }
// );

export default connect()(UserStatus);
