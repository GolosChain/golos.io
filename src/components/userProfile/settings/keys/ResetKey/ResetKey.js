import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { isEmpty } from 'ramda';
import { Form, Field } from 'react-final-form';
import cyber from 'cyber-client';
import { generateKeys } from 'cyber-client/lib/auth';

import { displaySuccess, displayError } from 'utils/toastMessages';
import { getNecessaryDelay } from 'utils/permissions';
import { secondsToDays } from 'utils/time';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { CardContent } from 'components/golos-ui/Card';
import {
  Input,
  CheckboxInput,
  FormError,
  FormFooter,
  FormFooterButton,
} from 'components/golos-ui/Form';

const FormErrorStyled = styled(FormError)`
  font-size: 13px;
  color: #f00;
`;

const RulesBlock = styled.div`
  padding: 13px 18px;
  margin-bottom: 28px;
  border: 1px solid #2879ff;
  border-radius: 6px;
`;

const Ol = styled.ol`
  list-style: none;
  counter-reset: li;
  margin: 0 0 0 15px;
`;

const Li = styled.li`
  counter-increment: li;
  font-size: 15px;

  &::before {
    content: counter(li);
    display: inline-block;
    width: 1em;
    margin-left: -1.5em;
    margin-right: 10px;

    font-weight: 900;
    font-size: 14px;
    text-align: right;
    color: #2879ff;
  }
`;

const Hint = styled.div`
  margin-top: 15px;
  font-size: 14px;
  line-height: 20px;
  color: #959595;
`;

const FieldBlock = styled.label`
  margin-bottom: 18px;
  cursor: pointer;
  user-select: none;
  text-transform: none;

  &:last-child {
    margin-bottom: 0;
  }

  ${is('mini')`
    margin-bottom: 10px;
  `};
`;

const LabelText = styled.div`
  font-size: 14px;
  color: #393636;
  user-select: none;
`;

const CheckboxLabel = styled.div`
  margin-left: 10px;
  color: #959595;
`;

const DelayWarning = styled.div`
  margin: 0 0 16px;
  color: #f00;
`;

export default class ResetKey extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    username: PropTypes.string,
    changePassword: PropTypes.func.isRequired,
  };

  state = {
    generatedKeys: {},
  };

  async componentWillMount() {
    const { userId, username } = this.props;

    // Если username нет (аккаунт был зарегистирован не через сайт golos.io), то используем userId.
    this.setState({ generatedKeys: await generateKeys(username || userId) });
  }

  validatePassword = password => {
    if (!password) {
      return tt('g.required');
    }

    if (password.startsWith('GLS')) {
      return tt('g.you_need_private_password_or_key_not_a_public_key');
    }

    try {
      const ownerKey = this.extractOwnerKey(password);

      if (!ownerKey) {
        return tt('chain_errors.tx_missing_owner_auth');
      }
    } catch (err) {
      return err.message;
    }

    return undefined;
  };

  validateConfirmPassword = (password, newPassword) => {
    if (!password) {
      return tt('g.required');
    }
    if (password.trim() !== newPassword) {
      return tt('g.passwords_do_not_match');
    }
    return undefined;
  };

  validate = values => ({
    password: this.validatePassword(values.password),
    confirmPassword: this.validateConfirmPassword(values.confirmPassword, values.newWif),
    confirmCheck: !values.confirmCheck ? tt('g.required') : undefined,
    confirmSaved: !values.confirmSaved ? tt('g.required') : undefined,
  });

  extractOwnerKey = password => {
    const { userId, username, publicKeys } = this.props;
    const ownerKey = publicKeys?.owner;

    let keyPair = cyber.getActualAuth(userId, password, 'owner');

    if (!ownerKey || keyPair.publicKey === ownerKey) {
      return keyPair.actualKey;
    }

    if (username) {
      keyPair = cyber.getActualAuth(username, password, 'owner');

      if (!ownerKey || keyPair.publicKey === ownerKey) {
        return keyPair.actualKey;
      }
    }

    return null;
  };

  onSubmitChangePassword = async values => {
    const { permissions, publicKeys, changePassword } = this.props;
    const { generatedKeys } = this.state;

    if (!publicKeys) {
      displayError('Keys is not found');
      return;
    }

    const availableRoles = Object.keys(publicKeys);
    const pubKeys = {};

    for (const role of availableRoles) {
      pubKeys[role] = generatedKeys[role].publicKey;
    }

    const ownerKey = this.extractOwnerKey(values.password);

    if (!ownerKey) {
      displayError(`Owner key can't be extracted`);
      return;
    }

    let delay;

    try {
      delay = getNecessaryDelay(permissions, 'owner');
    } catch (err) {
      displayError(err);
      return;
    }

    try {
      await changePassword({
        ownerKey,
        publicKeys: pubKeys,
        availableRoles,
        delaySec: delay,
      });
    } catch (err) {
      displayError(err);
      return;
    }

    if (delay) {
      displaySuccess(`Password will be updated in ${secondsToDays(delay)} days`);
    } else {
      displaySuccess('Password Updated');
    }
  };

  render() {
    const { userId, permissions } = this.props;
    const { generatedKeys } = this.state;

    let newWif = '';
    if (!isEmpty(generatedKeys)) {
      newWif = generatedKeys.master;
    }

    const initialData = {
      userId,
      newWif,
    };

    let delay;

    if (permissions) {
      try {
        delay = getNecessaryDelay(permissions, 'owner');
      } catch {}
    }

    return (
      <Form
        initialValues={initialData}
        validate={this.validate}
        onSubmit={this.onSubmitChangePassword}
      >
        {({ handleSubmit, submitError, form, submitting, pristine, hasValidationErrors }) => (
          <form onSubmit={handleSubmit}>
            {submitting && <SplashLoader />}
            <CardContent column>
              <RulesBlock>
                <Ol>
                  <Li>{tt('password_rules.p1')}</Li>
                  <Li>
                    <strong>{tt('password_rules.p2')}</strong>
                  </Li>
                  <Li>{tt('password_rules.p3')}</Li>
                  <Li>{tt('password_rules.p4')}</Li>
                  <Li>{tt('password_rules.p5')}</Li>
                  <Li>{tt('password_rules.p6')}</Li>
                  <Li>{tt('password_rules.p7')}</Li>
                </Ol>
              </RulesBlock>
              {delay ? (
                <DelayWarning>
                  {tt('reset_key.delay_warning', { delay: secondsToDays(delay) })}
                </DelayWarning>
              ) : null}
              <Field name="userId">
                {({ input, meta }) => (
                  <FieldBlock>
                    <LabelText>{tt('g.account_id')}</LabelText>
                    <Input {...input} type="text" autoComplete="off" disabled />
                    <FormErrorStyled meta={meta} />
                  </FieldBlock>
                )}
              </Field>
              <Field name="password">
                {({ input, meta }) => (
                  <FieldBlock>
                    <LabelText>{tt('g.current_password')}</LabelText>
                    <Input
                      {...input}
                      type="password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      autoComplete="new-password"
                      spellCheck="false"
                      disabled={submitting}
                    />
                    <FormErrorStyled meta={meta} />
                  </FieldBlock>
                )}
              </Field>
              <Field name="newWif">
                {({ input, meta }) => (
                  <FieldBlock>
                    <LabelText>{tt('g.generated_password')}</LabelText>
                    <Input
                      {...input}
                      type="text"
                      autoComplete="off"
                      disabled={submitting}
                      readOnly
                    />
                    <FormErrorStyled meta={meta} />
                    <Hint>{tt('g.backup_password_by_storing_it')}</Hint>
                  </FieldBlock>
                )}
              </Field>
              <Field name="confirmPassword">
                {({ input, meta }) => (
                  <FieldBlock>
                    <LabelText>{tt('g.re_enter_generate_password')}</LabelText>
                    <Input
                      {...input}
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      disabled={submitting}
                    />
                    <FormErrorStyled meta={meta} />
                  </FieldBlock>
                )}
              </Field>
              <Field name="confirmCheck">
                {({ input, meta }) => (
                  <FieldBlock mini>
                    <CheckboxInput
                      {...input}
                      title={
                        <CheckboxLabel>
                          {tt('g.understand_that_APP_NAME_cannot_recover_password', {
                            APP_NAME: 'GOLOS.io',
                          })}
                        </CheckboxLabel>
                      }
                    />
                    <FormErrorStyled meta={meta} />
                  </FieldBlock>
                )}
              </Field>
              <Field name="confirmSaved">
                {({ input, meta }) => (
                  <FieldBlock mini>
                    <CheckboxInput
                      {...input}
                      title={<CheckboxLabel>{tt('g.i_saved_password')}</CheckboxLabel>}
                    />
                    <FormErrorStyled meta={meta} />
                  </FieldBlock>
                )}
              </Field>
              {submitError && <div>{submitError}</div>}
            </CardContent>
            <FormFooter>
              <FormFooterButton onClick={form.reset} disabled={submitting || pristine}>
                {tt('settings_jsx.reset')}
              </FormFooterButton>
              <FormFooterButton
                type="submit"
                primary
                disabled={submitting || pristine || hasValidationErrors}
              >
                {tt('settings_jsx.update')}
              </FormFooterButton>
            </FormFooter>
          </form>
        )}
      </Form>
    );
  }
}
