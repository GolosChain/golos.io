import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Form, Field } from 'react-final-form';
import tt from 'counterpart';
import { ToggleFeature } from '@flopflip/react-redux';

import { CURRENCIES, LANGUAGES } from 'constants/config';
import { USER_SETTINGS } from 'shared/feature-flags';

import SplashLoader from 'components/golos-ui/SplashLoader';
import { CardContent } from 'components/golos-ui/Card';
import {
  FormGroup,
  Label,
  Select,
  RadioGroup,
  CheckboxInput,
  FormError,
  FormFooter,
  FormFooterButton,
} from 'components/golos-ui/Form';
import Slider from 'components/golos-ui/Slider';

const CheckboxTitle = styled.div`
  margin-left: 10px;
  color: #959595;
`;

export default class Common extends PureComponent {
  static propTypes = {
    options: PropTypes.shape({}).isRequired,
    isFetching: PropTypes.bool,

    onSubmitGate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isFetching: false,
  };

  onSubmit = data => {
    const { onSubmitGate } = this.props;

    onSubmitGate({
      basic: {
        ...data.basic,
        // Если чекбокс снят, то удаляем процент силы голосования
        votePower: data.hasVotePower ? data.basic.votePower : null,
      },
    });
  };

  render() {
    const { options } = this.props;
    const data = {
      basic: options.basic,
      hasVotePower: Boolean(options.basic?.votePower),
    };

    // TODO: should be replaced with real flag based on vestings quantity
    const isRich = true;

    return (
      <Form initialValues={data} onSubmit={this.onSubmit}>
        {({ handleSubmit, submitError, form, submitting, pristine, hasValidationErrors }) => (
          <form onSubmit={handleSubmit}>
            {submitting ? <SplashLoader /> : null}
            <CardContent column>
              <Field name="basic.lang">
                {({ input }) => (
                  <FormGroup>
                    <Label>{tt('settings_jsx.choose_language')}</Label>
                    <Select {...input} onChange={e => input.onChange(e.target.value)}>
                      {Object.keys(LANGUAGES).map(key => (
                        <option key={key} value={key}>
                          {LANGUAGES[key].value}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                )}
              </Field>
              <ToggleFeature flag={USER_SETTINGS}>
                <Field name="basic.currency">
                  {({ input }) => (
                    <FormGroup>
                      <Label>{tt('settings_jsx.choose_currency')}</Label>
                      <Select {...input} onChange={e => input.onChange(e.target.value)}>
                        {CURRENCIES.map(key => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                  )}
                </Field>
              </ToggleFeature>
              <Field name="basic.nsfw">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label dark bold>
                      {tt('settings_jsx.not_safe_for_work_nsfw_content')}
                    </Label>
                    <RadioGroup
                      options={[
                        {
                          id: 'hide',
                          title: tt('settings_jsx.always_hide'),
                        },
                        {
                          id: 'warn',
                          title: tt('settings_jsx.always_warn'),
                        },
                        {
                          id: 'show',
                          title: tt('settings_jsx.always_show'),
                        },
                      ]}
                      {...input}
                      light
                    />
                    <FormError meta={meta} />
                  </FormGroup>
                )}
              </Field>
              {isRich && (
                <Field name="hasVotePower">
                  {({ input, meta }) => (
                    <FormGroup>
                      <Label dark bold>
                        {tt('settings_jsx.voting')}
                      </Label>
                      <CheckboxInput
                        {...input}
                        title={
                          <CheckboxTitle>
                            {tt('settings_jsx.voting_power_by_default')}
                          </CheckboxTitle>
                        }
                      />
                      <FormError meta={meta} />
                    </FormGroup>
                  )}
                </Field>
              )}
              {isRich &&
                form.getFieldState('hasVotePower') &&
                form.getFieldState('hasVotePower').value && (
                  <Field name="basic.votePower">
                    {({ input, meta }) => (
                      <FormGroup>
                        <Slider
                          min={1}
                          max={100}
                          {...input}
                          value={input.value || 1}
                          showCaptions
                          hideHandleValue
                        />
                        <FormError meta={meta} />
                      </FormGroup>
                    )}
                  </Field>
                )}
              <Field name="basic.selfVote">
                {({ input, meta }) => (
                  <FormGroup>
                    <CheckboxInput
                      {...input}
                      title={<CheckboxTitle>{tt('settings_jsx.self_vote_default')}</CheckboxTitle>}
                    />
                    <FormError meta={meta} />
                  </FormGroup>
                )}
              </Field>
              <Field name="basic.rounding">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label dark bold>
                      {tt('settings_jsx.rounding_numbers.info_message')}
                    </Label>
                    <RadioGroup
                      options={[
                        {
                          id: 0,
                          title: tt('settings_jsx.rounding_numbers.integer'),
                        },
                        {
                          id: 1,
                          title: tt('settings_jsx.rounding_numbers.one_decimal'),
                        },
                        {
                          id: 2,
                          title: tt('settings_jsx.rounding_numbers.two_decimal'),
                        },
                        {
                          id: 3,
                          title: tt('settings_jsx.rounding_numbers.three_decimal'),
                        },
                      ]}
                      {...input}
                      value={Number(input.value)}
                      light
                    />
                    <FormError meta={meta} />
                  </FormGroup>
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
