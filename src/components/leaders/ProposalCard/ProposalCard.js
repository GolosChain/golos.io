import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { displayError, displaySuccess } from 'utils/toastMessages';
import { parsePercent } from 'utils/common';
import Button from 'components/golos-ui/Button';
import { CONTRACTS, FIELD_TYPES } from 'constants/communitySettings';

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
`;

const ChangesLine = styled.li`
  padding-left: 10px;
  border-left: 4px solid #888;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

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
    proposal: PropTypes.shape({
      id: PropTypes.string.isRequired,
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
      proposal: { proposalId, author },
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

    displaySuccess(tt('g.saved'));
  };

  tryToExec = async () => {
    const {
      execProposal,
      proposal: { proposalId, author },
    } = this.props;

    try {
      await execProposal({ proposer: author.userId, proposalId });
    } catch (err) {
      displayError(err);
      return;
    }

    displaySuccess(tt('g.saved'));
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

    return a.username.localeCompare(b.username);
  };

  renderApproveState() {
    const { proposal } = this.props;
    const { showRequestedSigns } = this.state;

    let approvedCount = 0;

    for (const { isSigned } of proposal.approves) {
      if (isSigned) {
        approvedCount++;
      }
    }

    return (
      <ApproveState>
        Approves: {approvedCount}/{proposal.approves.length}{' '}
        <ShowAllButton onClick={this.toggleRequestedSigns}>
          {showRequestedSigns ? 'Hide' : 'Show'} all requested signs
        </ShowAllButton>
      </ApproveState>
    );
  }

  renderRequestedSigns() {
    const { userId, proposal } = this.props;

    const items = proposal.approves.sort(this._sortApproves);

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

  renderFooter() {
    const { userId, proposal } = this.props;
    let approveSlot = null;

    if (userId) {
      const myApprove = proposal.approves.find(approve => approve.userId === userId);

      if (myApprove) {
        if (myApprove.isSigned) {
          approveSlot = <Approved>You have approved already</Approved>;
        } else if (!proposal.isExecuted) {
          approveSlot = <Button onClick={this.onApproveClick}>Approve</Button>;
        }
      }
    }

    return (
      <FooterButtons>
        {approveSlot}
        {proposal.isExecuted ? null : <Button onClick={this.tryToExec}>Try to exec</Button>}
      </FooterButtons>
    );
  }

  renderChangeLine = ({ structureName, values }, contract, i) => {
    let structure;

    if (contract) {
      structure = contract.structures.find(struct => struct.name === structureName);
    }

    return (
      <ChangesLine key={i}>
        <ChangeStructureName>
          {structure ? (
            structure.title
          ) : (
            <>
              <FieldTitle>Structure:</FieldTitle> {structureName}
            </>
          )}
        </ChangeStructureName>
        {this.renderChanges(structureName, structure, values)}
      </ChangesLine>
    );
  };

  renderChanges(structureName, structure, values) {
    const fields = [];

    const fieldNames = Object.keys(values);

    for (const fieldName of fieldNames) {
      const value = values[fieldName];
      let title = null;
      let finalValue = null;

      if (structure) {
        if (structure.fields) {
          title = structure.fields[fieldName];
        }

        if (!title && fieldNames.length > 1) {
          title = structure.title;
        }
      } else {
        title = fieldName;
      }

      const fieldType = structure?.fieldsTypes?.[fieldName];

      switch (fieldType) {
        case FIELD_TYPES.PERCENT:
          finalValue = parsePercent(value);
          break;
        default:
          finalValue = JSON.stringify(value, null, 2);
      }

      fields.push(
        <div key={fieldName.length}>
          {title ? `${title}: ` : null}
          {finalValue}
        </div>
      );
    }

    return <Changes>{fields}</Changes>;
  }

  render() {
    const { proposal } = this.props;
    const { showRequestedSigns } = this.state;
    const [, contractName] = proposal.code.split('.');
    const contract = CONTRACTS.find(contract => contract.contractName === contractName);

    return (
      <Wrapper>
        <Field>
          <FieldTitle>Author:</FieldTitle>{' '}
          <FieldValue>
            {proposal.author.username} ({proposal.author.userId})
          </FieldValue>
        </Field>
        <Field>
          <FieldTitle>Proposal id:</FieldTitle> <FieldValue>{proposal.proposalId}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Creation date:</FieldTitle>{' '}
          <FieldValue>{new Date(proposal.blockTime).toLocaleString()}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Expiration date:</FieldTitle>{' '}
          <FieldValue>{new Date(proposal.expiration).toLocaleString()}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Status:</FieldTitle>{' '}
          <FieldValue>{proposal.isExecuted ? 'executed' : 'waiting'}</FieldValue>
        </Field>
        {proposal.executedBlockTime ? (
          <Field>
            <FieldTitle>Execution date:</FieldTitle>{' '}
            <FieldValue>{new Date(proposal.executedBlockTime).toLocaleString()}</FieldValue>
          </Field>
        ) : null}
        <Field>
          <FieldTitle>Code:</FieldTitle> <FieldValue>{proposal.code}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Action:</FieldTitle> <FieldValue>{proposal.action}</FieldValue>
        </Field>
        {proposal.data ? <pre>{JSON.stringify(proposal.data, null, 2)}</pre> : null}
        {proposal.changes ? (
          <ChangesBlock>
            <FieldTitle>Changes:</FieldTitle>
            <ChangesList>
              {proposal.changes.map((struct, i) => this.renderChangeLine(struct, contract, i))}
            </ChangesList>
          </ChangesBlock>
        ) : null}
        {this.renderApproveState()}
        {showRequestedSigns ? this.renderRequestedSigns() : null}
        {this.renderFooter()}
      </Wrapper>
    );
  }
}
