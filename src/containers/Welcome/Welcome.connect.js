import { connect } from 'react-redux';

// import user from 'app/redux/User';
import Welcome from './Welcome';

export default connect(
  null,
  dispatch => ({
    getContent: payload =>
      new Promise((resolve, reject) => {
        dispatch({
          type: 'GET_CONTENT',
          payload: { ...payload, resolve, reject },
        });
      }),
    getAccount: payload =>
      new Promise((resolve, reject) => {
        dispatch(user.actions.getAccount({ ...payload, resolve, reject }));
      }),
  })
)(Welcome);
