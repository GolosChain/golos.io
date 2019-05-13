import React from 'react';
import tt from 'counterpart';
import { APP_NAME, SUPPORT_EMAIL } from 'constants/config';

class Support extends React.Component {
  render() {
    return (
      <div className="row">
        <div>
          <h2>{tt('g.APP_NAME_support', { APP_NAME })}</h2>
          <p>
            {tt('g.please_email_questions_to')}{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        </div>
      </div>
    );
  }
}

export default {
  path: 'support.html',
  component: Support,
};
