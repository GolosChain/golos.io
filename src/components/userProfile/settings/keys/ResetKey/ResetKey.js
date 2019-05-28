import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { isEmpty } from 'ramda';
import { Form, Field } from 'react-final-form';
import cyber from 'cyber-client';
import { generateKeys } from 'cyber-client/lib/auth';
import ToastsManager from 'toasts-manager';

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

export default class ResetKey extends PureComponent {
  static propTypes = {
    username: PropTypes.string.isRequired,
    publicKeys: PropTypes.shape({}).isRequired,
    changePassword: PropTypes.func.isRequired,
  };

  state = {
    generatedKeys: {},
  };

  async componentWillMount() {
    const { username } = this.props;
    this.setState({ generatedKeys: await generateKeys(username) });
  }

  validatePassword = password => {
    const { username, publicKeys } = this.props;

    if (!password) {
      return tt('g.required');
    }

    if (password.startsWith('GLS')) {
      return tt('g.you_need_private_password_or_key_not_a_public_key');
    }

    try {
      const keyPair = cyber.getActualAuth(username, password, 'owner');
      if (keyPair.publicKey !== publicKeys.owner) {
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

  // TODO clear account auths
  // getAccountAuths = account =>
  //   ['posting', 'active', 'owner'].reduce((acc, key) => {
  //     const auths = account.getIn([key, 'account_auths']);
  //     if (!auths.isEmpty()) {
  //       acc.push(auths);
  //     }
  //     return acc;
  //   }, []);

  onSubmitChangePassword = async values => {
    const { publicKeys, changePassword } = this.props;
    const { generatedKeys } = this.state;

    const availableRoles = Object.keys(publicKeys);
    const pubKeys = {};

    for (const role of availableRoles) {
      pubKeys[role] = generatedKeys[role].publicKey;
    }

    const result = await changePassword(values.password, pubKeys, availableRoles);
    if (result) {
      ToastsManager.info(`${values.username} Password Updated`);
    }
  };

  render() {
    const { username } = this.props;
    const { generatedKeys } = this.state;

    let newWif = '';
    if (!isEmpty(generatedKeys)) {
      newWif = generatedKeys.master;
    }

    const initialData = {
      username,
      newWif,
    };

    // TODO clear account auths
    // const accountAuths = this.getAccountAuths(account);
    const hasAuths = false; // accountAuths.length > 0;

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
              <Field name="username">
                {({ input, meta }) => (
                  <FieldBlock>
                    <LabelText>{tt('g.account_name')}</LabelText>
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
              {hasAuths && (
                <Field name="clearAccountAuths">
                  {({ input, meta }) => (
                    <FieldBlock mini>
                      <CheckboxInput
                        {...input}
                        title={<CheckboxLabel>{tt('g.clear_accounts_auths')}</CheckboxLabel>}
                      />
                      <FormErrorStyled meta={meta} />
                    </FieldBlock>
                  )}
                </Field>
              )}
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
