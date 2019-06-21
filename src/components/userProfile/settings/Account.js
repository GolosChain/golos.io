import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Field } from 'react-final-form';
import tt from 'counterpart';
import { omit } from 'ramda';

import { USER_GENDER } from 'constants/config';
import { profileType } from 'types/common';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { CardContent } from 'components/golos-ui/Card';
import {
  FormGroup,
  FormGroupRow,
  Label,
  LabelRow,
  Input,
  Select,
  Textarea,
  FormError,
  FormFooter,
  FormFooterButton,
} from 'components/golos-ui/Form';
import Icon from 'components/golos-ui/Icon';

const LabelIcon = styled(LabelRow)`
  flex-basis: 28px;
  color: #393636;
`;

const UserName = styled.div`
  color: #363636;
`;

const composeValidators = (...validators) => value => {
  for (const validator of validators) {
    const error = validator(value);

    if (error !== undefined) {
      return error;
    }
  }
};

const isLengthGreaterThan = (min, err) => value => {
  if (value && value.length > min) {
    return err;
  }
};

const isStartWithAt = err => value => {
  if (value && /^\s*@/.test(value)) {
    return err;
  }
};

const isNotUrl = err => value => {
  if (value && !/^https?:\/\//.test(value)) {
    return err;
  }
};

const composedUrlValidator = value =>
  composeValidators(
    isLengthGreaterThan(100, tt('settings_jsx.website_url_is_too_long')),
    isNotUrl(tt('settings_jsx.invalid_url'))
  )(value);

const usernameValidation = (username, err) => {
  if (username && /^[a-zA-Z0-9\-\.]+$/.test(username)) {
    return err;
  }
};

const validate = values => ({
  name: composeValidators(
    isLengthGreaterThan(20, tt('settings_jsx.name_is_too_long')),
    isStartWithAt(tt('settings_jsx.name_must_not_begin_with'))
  )(values.name),
  about: isLengthGreaterThan(160, tt('settings_jsx.about_is_too_long'))(values.about),
  location: isLengthGreaterThan(160, tt('settings_jsx.location_is_too_long'))(values.location),
  website: composedUrlValidator(values.website),
  facebook: usernameValidation(values.facebook),
  vk: usernameValidation(values.vk),
  instagram: usernameValidation(values.instagram),
  // twitter: usernameValidation(values.twitter),
});

function renderSocialField(placeholder, input, meta, icon) {
  return (
    <FormGroupRow>
      <LabelIcon>
        <Icon {...icon} />
      </LabelIcon>
      <Input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...input}
        type="text"
        placeholder={placeholder}
        value={input.value.replace(' ', '').trim()}
      />
      <FormError meta={meta} />
    </FormGroupRow>
  );
}

const Account = ({ profile, onSubmitBlockchain }) => (
  <Form
    initialValues={{
      userId: profile.userId,
      ...profile.personal,
    }}
    validate={validate}
    onSubmit={onSubmitBlockchain}
  >
    {({ handleSubmit, submitError, form, submitting, pristine, hasValidationErrors }) => (
      <form onSubmit={handleSubmit}>
        {submitting && <SplashLoader />}
        <CardContent column>
          <Field name="userId">
            {({ input }) => (
              <FormGroupRow justify="space-between">
                <LabelRow>{tt('settings_jsx.profile_userid')}</LabelRow>
                <UserName>@{input.value}</UserName>
              </FormGroupRow>
            )}
          </Field>
          <Field name="name">
            {({ input, meta }) => (
              <FormGroup>
                <Label>{tt('settings_jsx.profile_name')}</Label>
                <Input
                  {...input}
                  autocomplete="name"
                  type="text"
                  placeholder={tt('settings_jsx.account.placeholders.name')}
                />
                <FormError meta={meta} />
              </FormGroup>
            )}
          </Field>
          <Field name="gender">
            {({ input, meta }) => (
              <FormGroup>
                <Label>{tt('settings_jsx.profile_gender.title')}</Label>
                <Select {...input} placeholder={tt('settings_jsx.account.placeholders.gender')}>
                  {USER_GENDER.map(i => (
                    <option key={i} value={i}>
                      {tt(`settings_jsx.profile_gender.genders.${i}`)}
                    </option>
                  ))}
                </Select>
                <FormError meta={meta} />
              </FormGroup>
            )}
          </Field>
          <Field name="email">
            {({ input, meta }) => (
              <FormGroup>
                <Label>{tt('settings_jsx.profile_email')}</Label>
                <Input {...input} autocomplete="email" type="text" />
                <FormError meta={meta} />
              </FormGroup>
            )}
          </Field>
          <Field name="location">
            {({ input, meta }) => (
              <FormGroup>
                <Label>{tt('settings_jsx.profile_location')}</Label>
                <Input
                  {...input}
                  type="text"
                  placeholder={tt('settings_jsx.account.placeholders.location')}
                />
                <FormError meta={meta} />
              </FormGroup>
            )}
          </Field>
          <Field name="about">
            {({ input, meta }) => (
              <FormGroup>
                <Label>{tt('settings_jsx.profile_about')}</Label>
                <Textarea
                  {...input}
                  placeholder={tt('settings_jsx.account.placeholders.about')}
                  rows={6}
                />
                <FormError meta={meta} />
              </FormGroup>
            )}
          </Field>
          <Field name="website">
            {({ input, meta }) => (
              <FormGroup>
                <Label>{tt('settings_jsx.profile_website')}</Label>
                <Input
                  {...input}
                  type="text"
                  spellCheck="false"
                  placeholder={tt('settings_jsx.account.placeholders.website')}
                />
                <FormError meta={meta} />
              </FormGroup>
            )}
          </Field>
          <FormGroup>
            <Label>{tt('settings_jsx.social_networks')}</Label>
            <Field name="contacts.facebook">
              {({ input, meta }) =>
                renderSocialField(
                  tt('settings_jsx.account.placeholders.social_facebook'),
                  input,
                  meta,
                  {
                    name: 'facebook',
                    width: 13,
                    height: 24,
                  }
                )
              }
            </Field>
            <Field name="contacts.vkontakte">
              {({ input, meta }) =>
                renderSocialField(
                  tt('settings_jsx.account.placeholders.social_vkontakte'),
                  input,
                  meta,
                  {
                    name: 'vk',
                    width: 28,
                    height: 18,
                  }
                )
              }
            </Field>
            <Field name="contacts.instagram">
              {({ input, meta }) =>
                renderSocialField(
                  tt('settings_jsx.account.placeholders.social_instagram'),
                  input,
                  meta,
                  {
                    name: 'instagram',
                    size: 23,
                  }
                )
              }
            </Field>
            {/*
              <Field name="twitter">
                {({ input, meta }) =>
                  renderSocialField(
                    tt('settings_jsx.account.placeholders.social_twitter'),
                    input,
                    meta,
                    {
                      name: 'twitter',
                      width: 26,
                      height: 22,
                    }
                  )
                }
              </Field>
              */}
          </FormGroup>
          {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}

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

Account.propTypes = {
  profile: profileType.isRequired,
  onSubmitBlockchain: PropTypes.func.isRequired,
};

export default Account;
