import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { Form, Field } from 'react-final-form';
import tt from 'counterpart';

import { CardContent, CardDivider } from 'components/golos-ui/Card';
import { FormFooter, FormFooterButton } from 'components/golos-ui/Form';
import {
  FormGroup,
  FormGroupRow as StyledFormGroupRow,
  Label as StyledLabel,
  LabelRow as StyledLabelRow,
  Switcher,
  Error,
} from 'components/golos-ui/Form';
import Icon from 'components/golos-ui/Icon';

const Label = styled(StyledLabel)`
  margin-bottom: 20px;
`;

const FormGroupRow = styled(StyledFormGroupRow)`
  height: 20px;
`;

const LabelRow = styled(StyledLabelRow)`
  flex: 1;
  justify-content: flex-start;
`;

const LabelIcon = styled(StyledLabelRow)`
  flex-basis: 19px;
  color: #d7d7d7;
  margin-right: 20px;

  ${is('active')`
    color: #2879FF;
  `};
`;

const Online = ({ onSubmitGate }) => {
  // TODO:
  const data = {};

  return (
    <Form onSubmit={onSubmitGate} initialValues={data}>
      {({ handleSubmit, submitError, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <CardContent column>
            <FormGroup>
              <Label dark>Оффлайн уведомления</Label>
              <Field name="a">
                {({ input }) => (
                  <FormGroupRow>
                    <LabelIcon active={input.value}>
                      <Icon name="bell" width="19" height="20" />
                    </LabelIcon>
                    <LabelRow dark>Включить/выключить пуш уведомления</LabelRow>
                    <Switcher {...input} />
                  </FormGroupRow>
                )}
              </Field>
            </FormGroup>
          </CardContent>
          <CardDivider />
          <CardContent column>
            <Field name="b">
              {({ input }) => (
                <FormGroupRow>
                  <LabelRow dark>Количество полученных лайков и комментариев за сутки</LabelRow>
                  <Switcher {...input} />
                </FormGroupRow>
              )}
            </Field>
            <Field name="c">
              {({ input }) => (
                <FormGroupRow>
                  <LabelRow dark>Награда за пост</LabelRow>
                  <Switcher {...input} />
                </FormGroupRow>
              )}
            </Field>
            <Field name="c">
              {({ input }) => (
                <FormGroupRow>
                  <LabelRow dark>Количество поставленных лайков за сутки</LabelRow>
                  <Switcher {...input} />
                </FormGroupRow>
              )}
            </Field>
            <Field name="c">
              {({ input }) => (
                <FormGroupRow>
                  <LabelRow dark>Количество поставленных лайков за сутки</LabelRow>
                  <Switcher {...input} />
                </FormGroupRow>
              )}
            </Field>
            <Field name="c">
              {({ input }) => (
                <FormGroupRow>
                  <LabelRow dark>
                    Уведомление о публикации автора, на которого вы подписаны
                  </LabelRow>
                  <Switcher {...input} />
                </FormGroupRow>
              )}
            </Field>

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
};

export default Online;
