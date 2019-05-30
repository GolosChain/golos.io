import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { displayError } from 'utils/toastMessages';
import Button from 'components/golos-ui/Button';

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

const FooterButtons = styled.div`
  margin-top: 12px;
`;

export default class ProposalCard extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      proposalId: PropTypes.string.isRequired,
      author: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      }).isRequired,
      code: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      expiration: PropTypes.string.isRequired,
      changes: PropTypes.arrayOf(
        PropTypes.shape({
          structureName: PropTypes.string.isRequired,
          values: PropTypes.shape({}).isRequired,
        })
      ).isRequired,
    }).isRequired,
    approveProposal: PropTypes.func.isRequired,
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
    }
  };

  render() {
    const { data } = this.props;

    return (
      <Wrapper>
        <Field>
          <FieldTitle>Author:</FieldTitle> <FieldValue>{data.author.userId}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Proposal id:</FieldTitle> <FieldValue>{data.proposalId}</FieldValue>
        </Field>
        <Field>
          <FieldTitle>Expiration date:</FieldTitle>{' '}
          <FieldValue>{new Date(data.expiration).toLocaleString()}</FieldValue>
        </Field>
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
        <FooterButtons>
          <Button onClick={this.onApproveClick}>Approve</Button>
        </FooterButtons>
      </Wrapper>
    );
  }
}
