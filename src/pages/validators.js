import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import { entitiesSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { fetchProfileIfNeeded, getValidators } from 'store/actions/gate';
import { showDelegateVoteDialog } from 'store/actions/modals';
import PageHeader from 'components/common/PageHeader';
import SmartLink from 'components/common/SmartLink';
import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';

export const lineTemplate = '270px 170px minmax(360px, auto)';

const WrapperForBackground = styled.div`
  background-color: #f9f9f9;

  & button {
    outline: none;
  }
`;

const Wrapper = styled.div`
  max-width: 1150px;
  padding-bottom: 24px;
  margin: 0 auto 0;
`;

const TableWrapper = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const TableHeadItem = styled.div`
  align-self: center;
  padding-left: 16px;
  font-weight: bold;
  line-height: 1.2;
  color: #393636;
`;

const TableHead = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: ${lineTemplate};
  grid-template-rows: 56px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #fff;

  & ${TableHeadItem}:first-child {
    justify-self: start;
    padding-left: 16px;
  }
`;

///

const ellipsisStyles = `
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const WitnessInfoCeil = styled.div`
  display: flex;
  align-self: center;
  padding-left: 16px;
`;

const WitnessNumberAndName = styled(WitnessInfoCeil)`
  display: flex;

  & > * {
    font-weight: bold;
    color: #393636;
  }

  & > a {
    margin-left: 12px;
    ${ellipsisStyles};
  }

  & > a:hover {
    color: #2879ff;
  }
`;

const VoteButtonCeil = styled(WitnessInfoCeil)`
  justify-content: space-around;
  padding: 0;
`;

const VoteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border: 1px solid rgba(57, 54, 54, 0.3);
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    ${({ upvoted }) =>
      upvoted ? 'background-color: #0e69ff' : 'border: 1px solid rgba(57, 54, 54, 0.6)'};
  }

  ${is('unvote')`
    transform: scale(1, -1);
  `};

  ${is('upvoted')`
    background-color: #2879ff;
    border: 0;
  `};

  & svg {
    flex-shrink: 0;
    color: ${({ upvoted }) => (upvoted ? '#fff' : '#393636')};
  }
`;

const WrapperLine = styled.div`
  display: grid;
  grid-template-columns: ${lineTemplate};
  grid-template-rows: 55px;
  background-color: #f6f6f6;
  border-bottom: 1px solid #e1e1e1;
  transition: 0.25s background-color ease;

  & ${WitnessInfoCeil}:last-child {
    /*justify-self: end;*/
    padding-right: 16px;
  }

  ${is('collapsed')`
    background-color: #fff;
  `};

  ${is('isDeactive')`
    opacity: 0.4;
  `};
`;

const ExplorerLink = styled.a`
  letter-spacing: normal;
  margin-left: 14px;
  font-weight: normal;
  font-size: 15px;
  white-space: nowrap;

  &::before {
    content: '[ ';
  }

  &::after {
    content: ' ]';
  }
`;

const REFRESH_INTERVAL = 60 * 1000;

@connect(
  state => ({
    userId: currentUnsafeUserIdSelector(state),
    users: entitiesSelector('users')(state),
  }),
  { fetchProfileIfNeeded, getValidators, showDelegateVoteDialog }
)
export default class ValidatorsPage extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    getValidators: PropTypes.func.isRequired,
    fetchProfileIfNeeded: PropTypes.func.isRequired,
    showDelegateVoteDialog: PropTypes.func.isRequired,
    users: PropTypes.shape({}).isRequired,
  };

  state = {
    producers: [],
    producersUpdateTime: null,
  };

  interval = null;

  async componentDidMount() {
    await this._refreshData();
    this.interval = setInterval(this._refreshData.bind(this), REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async _refreshData() {
    const { fetchProfileIfNeeded, getValidators } = this.props;

    try {
      const { producers } = await getValidators();

      const profilesPromises = producers.map(producer => {
        return fetchProfileIfNeeded(producer.id);
      });

      await Promise.all(profilesPromises);

      this.setState({
        producers,
        producersUpdateTime: new Date(),
      });
    } catch (err) {
      console.error('Get producers error:', err);
    }
  }

  onDelegateVoteClick = (type, recipientName, recipientUsername, stakedAmount) => {
    const { showDelegateVoteDialog } = this.props;

    showDelegateVoteDialog({
      type,
      recipientName,
      recipientUsername,
      stakedAmount,
      hint: tt(`dialogs_transfer.delegatevote.hint_validator_${type}`),
    });
  };

  render() {
    const { userId, users } = this.props;
    const { producers, producersUpdateTime } = this.state;

    return (
      <WrapperForBackground>
        <Wrapper>
          <PageHeader
            title={
              <>
                {tt('validators_jsx.validators')}
                {userId ? (
                  <ExplorerLink
                    href={`https://explorer.cyberway.io/account/${userId}`}
                    target="_blank"
                  >
                    {tt('validators_jsx.go_to_explorer')}
                  </ExplorerLink>
                ) : null}
              </>
            }
            subTitle={
              <div>
                {producersUpdateTime
                  ? `${tt('validators_jsx.last_update')} ${new Date(
                      producersUpdateTime
                    ).toLocaleString()}`
                  : null}
              </div>
            }
            actions={() => (
              <Button onClick={() => this.onDelegateVoteClick('delegatevote')}>
                {tt('validators_jsx.vote')}
              </Button>
            )}
          />
          <TableWrapper>
            <TableHead>
              <TableHeadItem>{tt('validators_jsx.validator')}</TableHeadItem>
              <TableHeadItem>{tt('validators_jsx.your_votes')}</TableHeadItem>
              <TableHeadItem>{tt('validators_jsx.public_key')}</TableHeadItem>
            </TableHead>
            {producers.map((producer, index) => {
              const username = users[producer.id]?.username;

              return (
                <WrapperLine collapsed key={producer.id}>
                  <WitnessNumberAndName>
                    <div>{index + 1}</div>
                    <SmartLink route="profile" params={{ userId: producer.id, username: username }}>
                      <a>{username ? `@${username}` : producer.id}</a>
                    </SmartLink>
                  </WitnessNumberAndName>
                  <VoteButtonCeil>
                    {parseFloat(producer.voteQuantity) ? (
                      <VoteButton
                        aria-label={tt('validators_jsx.remove_vote')}
                        data-tooltip={tt('validators_jsx.remove_vote')}
                        onClick={() =>
                          this.onDelegateVoteClick(
                            'recallvote',
                            producer.id,
                            username,
                            producer.voteQuantity
                          )
                        }
                        unvote
                      >
                        <Icon name="chevron" size="10" />
                      </VoteButton>
                    ) : null}
                    {parseFloat(producer.voteQuantity) || null}
                    <VoteButton
                      aria-label={tt('validators_jsx.vote')}
                      data-tooltip={tt('validators_jsx.vote')}
                      onClick={() =>
                        this.onDelegateVoteClick('delegatevote', producer.id, username)
                      }
                    >
                      <Icon name="chevron" size="10" />
                    </VoteButton>
                  </VoteButtonCeil>
                  <WitnessInfoCeil>{producer.signKey}</WitnessInfoCeil>
                </WrapperLine>
              );
            })}
          </TableWrapper>
        </Wrapper>
      </WrapperForBackground>
    );
  }
}
