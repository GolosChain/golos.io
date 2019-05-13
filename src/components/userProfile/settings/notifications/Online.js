import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import tt from 'counterpart';

import { CardContent, CardDivider } from 'components/golos-ui/Card';
import { FormGroup, Switcher, FormFooter, FormFooterButton } from 'components/golos-ui/Form';
import Icon from 'components/golos-ui/Icon';

const SWITCHERS = [
  {
    name: 'upvote',
    label: 'settings_jsx.notifications.vote',
    icon: { name: 'like', width: '19', height: '20' },
  },
  {
    name: 'downvote',
    label: 'settings_jsx.notifications.flag',
    icon: { name: 'dislike', size: '18' },
  },
  {
    name: 'transfer',
    label: 'settings_jsx.notifications.transfer',
    icon: { name: 'coins', width: '20', height: '16' },
  },
  {
    name: 'reply',
    label: 'settings_jsx.notifications.reply',
    icon: { name: 'comment-reply', width: '19', height: '18' },
  },
  {
    name: 'subscribe',
    label: 'settings_jsx.notifications.subscribe',
    icon: { name: 'round-check', size: '18' },
  },
  {
    name: 'unsubscribe',
    label: 'settings_jsx.notifications.unsubscribe',
    icon: { name: 'round-cross', size: '18' },
  },
  {
    name: 'mention',
    label: 'settings_jsx.notifications.mention',
    icon: { name: 'at', size: '17' },
  },
  {
    name: 'repost',
    label: 'settings_jsx.notifications.repost',
    icon: { name: 'repost', width: '19', height: '15' },
  },
  {
    name: 'reward',
    label: 'settings_jsx.notifications.award',
    icon: { name: 'a', width: '14', height: '15' },
  },
  {
    name: 'curatorReward',
    label: 'settings_jsx.notifications.curatorAward',
    icon: { name: 'k', width: '13', height: '15' },
  },
  {
    name: 'witnessVote',
    label: 'settings_jsx.notifications.witnessVote',
    icon: { name: 'like', width: '19', height: '20' },
  },
  {
    name: 'witnessCancelVote',
    label: 'settings_jsx.notifications.witnessCancelVote',
    icon: { name: 'dislike', size: '18' },
  },
];

const GroupTitle = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  color: #393636;
`;

const FormRow = styled.label`
  display: flex;
  align-items: center;
  padding: 4px 0;
  margin: 4px 0;
  text-transform: none;
  user-select: none;
  cursor: pointer;

  &:first-child {
    margin-top: -4px;
  }

  &:last-child {
    margin-bottom: -4px;
  }
`;

const OptionText = styled.div`
  flex-grow: 1;
  font-size: 14px;
  color: #393636;
`;

const OptionIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 19px;
  margin-right: 20px;
  color: #d7d7d7;

  ${is('active')`
    color: #2879ff;
  `};
`;

const OptionIcon = styled(Icon)`
  display: block;
`;

function isAllEnabled(show) {
  for (const { name } of SWITCHERS) {
    if (!show[name]) {
      return undefined;
    }
  }

  return true;
}

export default class Online extends PureComponent {
  static propTypes = {
    options: PropTypes.object.isRequired,
    onSubmitGate: PropTypes.func,
  };

  state = {
    options: {
      ...this.props.options.notify,
      switchAll: isAllEnabled(this.props.options.notify.show),
    },
  };

  calculateSwitchAllDecorator = createDecorator(
    {
      field: 'switchAll',
      updates: (value, name, values) => {
        // Если value === undefined значит клик был не на switchAll
        if (typeof value === 'boolean') {
          for (const { name } of SWITCHERS) {
            values.show[name] = value;
          }
        }

        return values;
      },
    },
    {
      field: /^show\./,
      updates: (value, name, values) => ({
        ...values,
        switchAll: isAllEnabled(values.show),
      }),
    }
  );

  handleSubmit = values =>
    this.props.onSubmitGate({
      notify: values,
    });

  renderSwitchers = () =>
    SWITCHERS.map(({ name, label, icon }, key) => (
      <Field key={key} name={`show.${name}`}>
        {({ input }) => this.renderSwitcher({ input, label, icon })}
      </Field>
    ));

  renderSwitcher = ({ input, label, icon }) => (
    <FormRow>
      <OptionIconWrapper active={input.value}>
        <OptionIcon {...icon} />
      </OptionIconWrapper>
      <OptionText dark>{tt(label)}</OptionText>
      <Switcher {...input} />
    </FormRow>
  );

  render() {
    const { options } = this.state;

    return (
      <Form
        decorators={[this.calculateSwitchAllDecorator]}
        initialValues={options}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitError, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <CardContent column>
              <Field name="switchAll">
                {({ input }) => (
                  <FormGroup>
                    <GroupTitle dark>{tt('settings_jsx.notifications.allOnlineLabel')}</GroupTitle>
                    {this.renderSwitcher({
                      input,
                      label: 'settings_jsx.notifications.allOnline',
                      icon: { name: 'bell', width: 19, height: 20 },
                    })}
                  </FormGroup>
                )}
              </Field>
            </CardContent>
            <CardDivider />
            <CardContent column>
              {this.renderSwitchers()}
              {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}

              {submitError && <div>{submitError}</div>}
            </CardContent>
            <FormFooter>
              <FormFooterButton onClick={form.reset} disabled={submitting || pristine}>
                {tt('settings_jsx.reset')}
              </FormFooterButton>
              <FormFooterButton type="submit" primary disabled={submitting}>
                {tt('settings_jsx.update')}
              </FormFooterButton>
            </FormFooter>
          </form>
        )}
      </Form>
    );
  }
}
