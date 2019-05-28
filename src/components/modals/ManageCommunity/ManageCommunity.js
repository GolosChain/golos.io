import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import ToastsManager from 'toasts-manager';

import { displayError, displaySuccess } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';
import { Input } from 'components/golos-ui/Form';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { setPublishParams } from '../../../store/actions/cyberway';

const Wrapper = styled.div`
  position: relative;
  padding: 20px 30px 28px;
  border-radius: 6px;
  background-color: #fff;
`;

const HeaderTitle = styled.h1`
  margin: 0 0 20px 0;
`;

const Fields = styled.div`
  margin-bottom: 20px;
`;

const Field = styled.label`
  text-transform: none;
`;

const FieldTitle = styled.h2`
  display: block;
  margin-bottom: 6px;
  font-weight: normal;
`;

const FieldSubTitle = styled.h3`
  display: block;
  font-size: 15px;
  font-weight: normal;
`;

const FooterButtons = styled.div`
  & > :not(:last-child) {
    margin-right: 12px;
  }
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding-right: 4px;
`;

export default class ManageCommunity extends PureComponent {
  static propTypes = {
    close: PropTypes.func.isRequired,
    setPublishParams: PropTypes.func.isRequired,
  };

  state = {
    isSaving: false,
    curatorMin: 25,
    curatorMax: 75,
  };

  onCurationMinChange = e => {
    this.setState({
      curatorMin: e.target.value,
    });
  };

  onCurationMaxChange = e => {
    this.setState({
      curatorMax: e.target.value,
    });
  };

  onUpdateClick = async () => {
    const { setPublishParams, close } = this.props;
    const { curatorMin, curatorMax } = this.state;

    const min = parseInt(curatorMin, 10);
    const max = parseInt(curatorMax, 10);

    if (Number.isNaN(min) || Number.isNaN(max) || min > max || min < 0 || max > 100) {
      ToastsManager.error('Введены некорректные значения');
      return;
    }

    this.setState({
      isSaving: true,
    });

    try {
      await setPublishParams({ curatorMin: min * 100, curatorMax: max * 100 });
      displaySuccess('Success');
      close();
    } catch (err) {
      displayError(err);
    }

    this.setState({
      isSaving: false,
    });
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { isSaving, curatorMin, curatorMax } = this.state;

    return (
      <Wrapper>
        <HeaderTitle>Параметры сообщества</HeaderTitle>
        <Fields>
          <Field>
            <FieldTitle>Кураторские выплаты:</FieldTitle>
            <FieldSubTitle>Минимум (%)</FieldSubTitle>
            <InputSmall
              type="number"
              value={curatorMin}
              min="0"
              max="100"
              onChange={this.onCurationMinChange}
            />
            <FieldSubTitle>Максимум (%)</FieldSubTitle>
            <InputSmall
              type="number"
              value={curatorMax}
              min="0"
              max="100"
              onChange={this.onCurationMaxChange}
            />
          </Field>
        </Fields>
        <FooterButtons>
          <Button disabled={isSaving} onClick={this.onUpdateClick}>
            Сохранить
          </Button>
          <Button light onClick={this.onCancelClick}>
            {tt('g.cancel')}
          </Button>
        </FooterButtons>
        {isSaving ? <SplashLoader /> : null}
      </Wrapper>
    );
  }
}
