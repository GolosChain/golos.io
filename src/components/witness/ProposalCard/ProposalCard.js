import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { displayError, displaySuccess } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';

const APPROVE_STATES = {
  NONE: 'none',
  APPROVED: 'approved',
  WAIT_FOR_APPROVE: 'wait-for-approve',
};

const Wrapper = styled.div`
  padding: 12px 18px 18px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
`;

const Field = styled.label`
  display: block;
  text-transform: none;
`;

const FieldTitle = styled.span`
  color: #666;
`;

const FieldValue = styled.span`
  font-weight: 500;
`;

const ChangesBlock = styled.div``;

const ChangesList = styled.ul`
  padding: 6px 12px;
  list-style: none;
  border: 1px solid #888;
`;

const ChangesLine = styled.li``;

const ChangeStructureName = styled.div``;

const Changes = styled.pre`
  font-size: 12px;
`;

const ApproveState = styled.div`
  margin: 10px 0;
  color: #393;
`;

const ShowAllButton = styled.button.attrs({ type: 'button' })`
  margin-left: 10px;
  text-decoration: underline;
  cursor: pointer;
`;

const SignsList = styled.ul``;

const SignLine = styled.li``;

const UserName = styled.span`
  ${is('isMe')`
    font-weight: 500;
  `};
`;

const Signed = styled.span`
  color: #393;
`;

const NotSigned = styled.span`
  color: #373737;
`;

const FooterButtons = styled.div`
  margin-top: 10px;

  & > :not(:last-child) {
    margin-right: 8px;
  }
`;

const Approved = styled.span`
  color: #393;
`;

export default class ProposalCard extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    data: PropTypes.shape({
      proposalId: PropTypes.string.isRequired,
      author: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      }).isRequired,
      code: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      blockTime: PropTypes.string.isRequired,
      expiration: PropTypes.string.isRequired,
      isExecuted: PropTypes.bool.isRequired,
      executedBlockTime: PropTypes.string.isRequired,
      changes: PropTypes.arrayOf(
        PropTypes.shape({
          structureName: PropTypes.string.isRequired,
          values: PropTypes.shape({}).isRequired,
        })
      ).isRequired,
    }).isRequired,
    approveProposal: PropTypes.func.isRequired,
    execProposal: PropTypes.func.isRequired,
  };

  state = {
    showRequestedSigns: false,
  };

  onApproveClick = async () => {
    const {
      approveProposal,
      data: { proposalId, author },
    } = this.props;

    try {
      await approveProposal({
        proposer: author.userId,
        proposalId,
      });
    } catch (err) {
      displayError(err);
      return;
    }

    displaySuccess('Success');
  };

  tryToExec = async () => {
    const {
      execProposal,
      data: { proposalId, author },
    } = this.props;

    try {
      await execProposal({ proposer: author.userId, proposalId });
    } catch (err) {
      displayError(err);
      return;
    }

    displaySuccess('Success');
  };

  toggleRequestedSigns = () => {
    this.setState(state => ({
      showRequestedSigns: !state.showRequestedSigns,
    }));
  };

  _sortApproves = (a, b) => {
    const { userId } = this.props;

    if (a.isSigned && !b.isSigned) {
      return -1;
    }

    if (!a.isSigned && b.isSigned) {
      return 1;
    }

    if (userId) {
      if (a.userId === userId) {
        return -1;
      }

      if (b.userId === userId) {
        return 1;
      }
    }

    return a.userId.localeCompare(b.userId);
  };

  renderApproveState() {
    const { data } = this.props;
    const { showRequestedSigns } = this.state;

    let approvedCount = 0;

    for (const { isSigned } of data.approves) {
      if (isSigned) {
        approvedCount++;
      }
    }

    return (
      <ApproveState>
        Approves: {approvedCount}/{data.approves.length}{' '}
        <ShowAllButton onClick={this.toggleRequestedSigns}>
          {showRequestedSigns ? 'Hide' : 'Show'} all requested signs
        </ShowAllButton>
      </ApproveState>
    );
  }

  renderRequestedSigns() {
    const { userId, data } = this.props;

    const items = data.approves.sort(this._sortApproves);

    return (
      <SignsList>
        {items.map(approve => (
          <SignLine key={approve.userId}>
            <UserName isMe={approve.userId === userId}>
              {approve.username} ({approve.userId})
            </UserName>{' '}
            {approve.isSigned ? <Signed>Signed</Signed> : <NotSigned>Not signed yet</NotSigned>}
          </SignLine>
        ))}
      </SignsList>
    );
  }

  render() {
    const { userId, data } = this.props;
    const { showRequestedSigns } = this.state;

    let approveState = APPROVE_STATES.NONE;

    if (userId) {
      const approve = data.approves.find(approve => approve.userId === userId);

      if (approve) {
        if (approve.isSigned) {
          approveState = APPROVE_STATES.APPROVED;
        } else if (!data.isExecuted) {
          approveState = APPROVE_STATES.WAIT_FOR_APPROVE;
        }
      }
    }

    return (
      <Wrapper>
        <Field>
          <FieldTitle>Author:</FieldTitle>{' '}
          <FieldValue>
            {data.author.username} ({data.author.userId})
          </FieldValue>
        </Field>
        <Field>
          <FieldTitle>Proposal id:</FieldTitle> <FieldValue>{data.proposalId}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Creation date:</FieldTitle>{' '}
          <FieldValue>{new Date(data.blockTime).toLocaleString()}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Expiration date:</FieldTitle>{' '}
          <FieldValue>{new Date(data.expiration).toLocaleString()}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Status:</FieldTitle>{' '}
          <FieldValue>{data.isExecuted ? 'executed' : 'waiting'}</FieldValue>
        </Field>
        {data.executedBlockTime ? (
          <Field>
            <FieldTitle>Execution date:</FieldTitle>{' '}
            <FieldValue>{new Date(data.executedBlockTime).toLocaleString()}</FieldValue>
          </Field>
        ) : null}
        <Field>
          <FieldTitle>Code:</FieldTitle> <FieldValue>{data.code}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Action:</FieldTitle> <FieldValue>{data.action}</FieldValue>
        </Field>
        <ChangesBlock>
          <FieldTitle>Changes:</FieldTitle>
          <ChangesList>
            {data.changes.map(({ structureName, values }, i) => (
              <ChangesLine key={i}>
                <ChangeStructureName>
                  <FieldTitle>Structure:</FieldTitle> {structureName}
                </ChangeStructureName>
                <Changes>{JSON.stringify(values, null, 2)}</Changes>
              </ChangesLine>
            ))}
          </ChangesList>
        </ChangesBlock>
        {this.renderApproveState()}
        {showRequestedSigns ? this.renderRequestedSigns() : null}
        <FooterButtons>
          {approveState === APPROVE_STATES.NONE ? null : approveState ===
            APPROVE_STATES.APPROVED ? (
            <Approved>You have approved already</Approved>
          ) : approveState === APPROVE_STATES.WAIT_FOR_APPROVE ? (
            <Button onClick={this.onApproveClick}>Approve</Button>
          ) : null}
          {data.isExecuted ? null : <Button onClick={this.tryToExec}>Try to exec</Button>}
        </FooterButtons>
      </Wrapper>
    );
  }
}
