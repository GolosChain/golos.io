import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { displayError, displaySuccess } from 'utils/toastMessages';
import { generateRandomProposalId } from 'store/actions/cyberway';
import Button from 'components/golos-ui/Button';
import { Input, Textarea } from 'components/golos-ui/Form';
import Icon from 'components/golos-ui/Icon';
import SplashLoader from 'components/golos-ui/SplashLoader';

// Фиксированный префикс нужен, чтобы можно было отличить обычные пропозалы от тех что созданы через форму.
const PROPOSAL_PREFIX = 'lead';

const Wrapper = styled.div`
  position: relative;
  min-width: 600px;
  max-width: 600px;
  padding: 20px 0 28px;
  border-radius: 6px;
  background-color: #fff;
`;

const Content = styled.div`
  padding: 0 30px;
`;

const HeaderTitle = styled.h1`
  padding: 0 30px;
  margin: 15px 0 24px 0;
  text-align: center;
  line-height: 32px;
`;

const Field = styled.label`
  display: block;
  margin: 10px 0;
  text-transform: initial;
`;

const FieldTitle = styled.div`
  flex-grow: 1;
  font-weight: 500;
  color: #5e5e5e;
`;

const ProposalInputBlock = styled.div`
  display: flex;
  align-items: center;
`;

const ProposalIdInput = styled(Input)`
  width: 144px;
  background-color: #eee;
`;

const IconButton = styled(Button)`
  position: relative;
  width: 28px;
  height: 28px;
  padding: 0;
  margin-left: -32px;
  z-index: 1;
  border: none;
  background: none;
`;

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const Warn = styled.span`
  font-size: 14px;
  color: #800;
`;

const OrBlock = styled.div`
  position: relative;
  height: 24px;
  margin: 4px 0;

  &::before {
    position: absolute;
    content: '';
    top: 50%;
    left: 80px;
    right: 80px;
    border-bottom: 1px solid #999;
  }
`;

const OrWrapper = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Or = styled.span`
  padding: 0 12px;
  background: #fff;
`;

const TextareaStyled = styled(Textarea)`
  width: 100%;
  height: 280px;
  resize: none;

  ${is('isInvalid')`
    border-color: #700;
  `};

  &::placeholder {
    color: #999;
  }
`;

const UploadBlock = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0 36px;
`;

const UploadButton = styled.input.attrs({
  type: 'file',
  accept: 'text/*,application/json',
})``;

const AuthorizationBlock = styled.label`
  display: block;
  margin: 20px 0 35px;
  text-transform: initial;
`;

const AuthTopLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const FillLeadersButton = styled(Button)`
  height: 25px;
  padding: 0 10px;
  margin-left: 8px;
  font-size: 11px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  & > :not(:last-child) {
    margin-right: 8px;
  }
`;

const ExplorerLink = styled.a`
  word-break: break-all;
`;

const STEPS = {
  FIRST: 'FIRST',
  SUCCESS: 'SUCCESS',
};

const t = name => tt(['witnesses_jsx', 'custom_proposal', name]);

export default class CustomProposal extends PureComponent {
  static propTypes = {
    createCustomProposal: PropTypes.func.isRequired,
    getTopLeaders: PropTypes.func.isRequired,
  };

  state = {
    step: STEPS.FIRST,
    proposalId: generateRandomProposalId(PROPOSAL_PREFIX),
    text: '',
    auth: '',
    isValid: true,
    isLoading: false,
    transactionId: null,
  };

  validateText = text => {
    try {
      JSON.parse(text);
    } catch {
      return false;
    }

    return true;
  };

  onTextChange = e => {
    this.setState({
      text: e.target.value,
      isValid: this.validateText(e.target.value),
    });
  };

  onFileChange = async e => {
    const input = e.target;
    const file = input.files[0];

    let text;

    try {
      text = await file.text();
      input.value = null;
    } catch (err) {
      displayError(err);
    }

    this.setState({
      text,
      isValid: this.validateText(text),
    });
  };

  onAuthChange = e => {
    this.setState({
      auth: e.target.value,
    });
  };

  onGenerateIdClick = e => {
    this.setState({
      proposalId: generateRandomProposalId(PROPOSAL_PREFIX),
    });
  };

  onFillByLeadersClick = async () => {
    const { getTopLeaders } = this.props;

    this.setState({ isLoading: true });

    let leaders;

    try {
      leaders = await getTopLeaders();
    } catch (err) {
      displayError(err);
      this.setState({ isLoading: false });
      return;
    }

    const auth = leaders.map(leader => leader.actor).join(',');

    this.setState({
      auth,
      isLoading: false,
    });
  };

  onCreateClick = async () => {
    const { createCustomProposal } = this.props;
    const { text, auth, proposalId } = this.state;

    const trimmedAuth = auth.trim();

    if (!trimmedAuth) {
      displayError('Empty authorization list');
      return;
    }

    const authList = trimmedAuth
      .split(/\s*[,;]+\s*/)
      .map(actor => ({ actor, permission: 'active' }));

    this.setState({ isLoading: true });

    try {
      const results = await createCustomProposal({
        transaction: JSON.parse(text),
        requested: authList,
        proposalId,
      });

      this.setState({
        step: 'SUCCESS',
        transactionId: results.transaction_id,
        isLoading: false,
      });

      displaySuccess('Success');
    } catch (err) {
      displayError(err);
      this.setState({ isLoading: false });
    }
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  canClose() {
    return false;
  }

  renderFirstStep() {
    const { text, auth, proposalId, isValid, isLoading } = this.state;

    return (
      <>
        <HeaderTitle>{t('title')}</HeaderTitle>
        <Content>
          <Field>
            <FieldTitle>{t('id_title')}:</FieldTitle>
            <ProposalInputBlock>
              <ProposalIdInput value={proposalId} readOnly />
              <IconButton light onClick={this.onGenerateIdClick}>
                <IconStyled name="refresh2" />
              </IconButton>
            </ProposalInputBlock>
          </Field>
          <Field>
            <FieldTitle>
              {t('transaction_title')}: {isValid ? null : <Warn>({t('invalid')})</Warn>}
            </FieldTitle>
            <TextareaStyled
              placeholder={t('text_placeholder')}
              value={text}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              isInvalid={!isValid}
              disabled={isLoading}
              onChange={this.onTextChange}
            />
          </Field>
          <OrBlock>
            <OrWrapper>
              <Or>{t('upload_title')}:</Or>
            </OrWrapper>
          </OrBlock>
          <UploadBlock>
            <UploadButton disabled={isLoading} onChange={this.onFileChange} />
          </UploadBlock>
          <AuthorizationBlock>
            <AuthTopLine>
              <FieldTitle>{t('authorization_title')}:</FieldTitle>
              <FillLeadersButton disabled={isLoading} onClick={this.onFillByLeadersClick}>
                {t('fill_leaders')}
              </FillLeadersButton>
            </AuthTopLine>
            <Input value={auth} onChange={this.onAuthChange} />
          </AuthorizationBlock>
          <Actions>
            <Button disabled={!isValid || !text || isLoading} onClick={this.onCreateClick}>
              {t('create_button')}
            </Button>
            <Button light disabled={isLoading} onClick={this.onCancelClick}>
              {tt('g.cancel')}
            </Button>
          </Actions>
        </Content>
        {isLoading ? <SplashLoader /> : null}
      </>
    );
  }

  renderSuccessStep() {
    const { proposalId, transactionId } = this.state;

    const url = `https://explorer.cyberway.io/trx/${transactionId}`;

    return (
      <>
        <HeaderTitle>{t('success_title')}</HeaderTitle>
        <Content>
          <Field>
            <FieldTitle>{t('id_title')}:</FieldTitle>
            <Input readOnly value={proposalId} />
          </Field>
          <Field>
            <FieldTitle>{t('proposal_trx_id')}:</FieldTitle>
            <Input readOnly value={transactionId} />
          </Field>
          <Field>
            <FieldTitle>{t('see_explorer')}:</FieldTitle>
            <ExplorerLink target="_blank" href={url}>
              {url}
            </ExplorerLink>
          </Field>
        </Content>
      </>
    );
  }

  render() {
    const { step } = this.state;

    let content = null;

    switch (step) {
      case STEPS.FIRST:
        content = this.renderFirstStep();
        break;
      case STEPS.SUCCESS:
        content = this.renderSuccessStep();
        break;
      default:
        throw new Error('Invalid step');
    }

    return <Wrapper>{content}</Wrapper>;
  }
}
