import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'shared/routes';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { breakWordStyles } from 'helpers/styles';
import { MIN_VOICE_POWER } from 'constants/config';
import DialogManager from 'components/elements/common/DialogManager';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import { golosToVests, getVesting } from 'utils/StateFunctions';

import Icon from 'components/golos-ui/Icon';
import SplashLoader from 'components/golos-ui/SplashLoader';

import Linkify from 'components/common/Linkify';
import TextCut from 'components/common/TextCut';
import EditGolosPower from 'components/userProfile/common/EditGolosPower';
import {
  DIRECTION,
  CURRENCY_COLOR,
} from 'containers/userProfile/wallet/WalletContent/WalletContent';
import PostLink from './RewardTrxTitle';

const Root = styled.div`
  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0 20px;
`;

const LineIcon = styled(Icon)`
  flex-shrink: 0;
  width: 24px;
  height: 80px;
  color: ${props => props.color || '#b7b7ba'};
`;

const Who = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 10px;
  padding: 0 16px;
  height: 80px;
  overflow: hidden;
`;

const WhoName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhoTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhoLink = styled.a`
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TimeStamp = styled.div`
  font-size: 12px;
  color: #959595;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Memo = styled.div`
  margin-left: 10px;
  display: flex;
  flex-grow: 1.5;
  flex-basis: 10px;
  overflow: hidden;

  @media (min-width: 890px) and (max-width: 1050px), (max-width: 550px) {
    flex-grow: 0;
    min-width: 24px;
  }
`;

const MemoIcon = styled(Icon)`
  display: block;
  flex-shrink: 0;
  flex-basis: 24px;
  margin-top: 28px;
  color: #333;
  transition: color 0.15s;

  ${is('text')}:hover {
    color: #3684ff;
  }
`;

const MemoCut = styled(TextCut)`
  flex-grow: 1;
  margin: 15px 0;
  padding: 0 40px;

  @media (min-width: 890px) and (max-width: 1050px), (max-width: 550px) {
    display: none;
  }
`;

const MemoCentrer = styled.div`
  &::after {
    display: inline-block;
    content: '';
    height: 50px;
    vertical-align: middle;
  }
`;

const MemoText = styled.div`
  display: inline-block;
  width: 100%;
  padding: 4px 0;
  line-height: 1.4em;
  vertical-align: middle;
  ${breakWordStyles};
`;

const DataLink = styled.a`
  flex-grow: 1;
  flex-basis: 10px;
  max-height: 40px;
  margin-right: 8px;
  line-height: 1.3em;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Currencies = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 80px;
  margin-left: 6px;
  overflow: hidden;
`;

const ListValue = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  flex-direction: column;
  margin-right: 9px;

  &:last-child {
    margin-right: 0;
  }
`;

const Value = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
  width: auto;
  height: 80px;
  justify-content: center;
`;

const Amount = styled.div`
  margin-top: 2px;
  line-height: 24px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.color || '#b7b7ba'};
  white-space: nowrap;
  overflow: hidden;

  @media (min-width: 890px) and (max-width: 1023px), (max-width: 639px) {
    font-size: 18px;
  }
`;

const Currency = styled.div`
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
`;

const EditDelegationBlock = styled.div`
  position: relative;
  height: 0;
  padding: 0 20px;
  transition: height 0.15s;
  overflow: hidden;
  will-change: height;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 10px;
  flex-grow: 0.5;
  height: 80px;
`;

const ActionIcon = styled(Icon)`
  width: 36px;
  height: 36px;
  padding: 8px;
  margin-right: 20px;
  user-select: none;
  color: #333;
  cursor: pointer;
  transition: color 0.15s;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: ${props => props.color};
  }
`;

export default class WalletLine extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    account: PropTypes.any,
    delegationData: PropTypes.array,
    delegate: PropTypes.func.isRequired,
    onLoadDelegationsData: PropTypes.func.isRequired,
    getContent: PropTypes.func.isRequired,
  };

  state = {
    edit: false,
    loader: false,
    startEditDelegationGrow: false,
  };

  componentWillUnmount() {
    if (this._resetTimeout) {
      clearTimeout(this._resetTimeout);
    }
  }

  render() {
    const { data, getContent, postsContent } = this.props;
    const { loader } = this.state;
    const {
      timestamp,
      icon,
      color,
      name,
      type,
      title,
      post,
      memo,
      memoIconText,
      link,
      showDelegationActions,
      currencies,
      amount,
      currency,
    } = data;

    const CURRENCY_TRANSLATE = {
      GOLOS: tt('token_names.LIQUID_TOKEN'),
      GOLOS_POWER: tt('token_names.VESTING_TOKEN'),
    };

    return (
      <Root>
        <Line>
          <LineIcon name={icon} color={color} />
          <Who>
            {name ? (
              <WhoName>
                {type === DIRECTION.SENT
                  ? tt('user_wallet.content.to')
                  : tt('user_wallet.content.from')}{' '}
                <Link route={`/@${name}`} passHref>
                  <WhoLink>@{name}</WhoLink>
                </Link>
              </WhoName>
            ) : null}
            {title ? <WhoTitle>{title}</WhoTitle> : null}
            {post ? (
              <PostLink post={post} getContent={getContent} postsContent={postsContent} />
            ) : null}
            <TimeStamp>
              <TimeAgoWrapper date={timestamp} />
            </TimeStamp>
          </Who>
          {memo ? (
            <Memo>
              <MemoIcon name="note" text={memoIconText} data-hint={memoIconText} />
              <MemoCut height={50}>
                <MemoCentrer>
                  <MemoText>
                    <Linkify>{memo}</Linkify>
                  </MemoText>
                </MemoCentrer>
              </MemoCut>
            </Memo>
          ) : null}
          {data.data ? (
            <Link route={link} passHref>
              <DataLink>{data.data}</DataLink>
            </Link>
          ) : null}
          {showDelegationActions ? this.renderDelegationActions() : null}
          {currencies ? (
            <Currencies>
              {currencies.map(({ amount, currency }) => (
                <ListValue key={currency}>
                  <Amount color={CURRENCY_COLOR[currency]}>{amount}</Amount>
                  <Currency>{CURRENCY_TRANSLATE[currency]}</Currency>
                </ListValue>
              ))}
            </Currencies>
          ) : (
            <Value>
              <Amount color={color}>{amount}</Amount>
              <Currency>{CURRENCY_TRANSLATE[currency]}</Currency>
            </Value>
          )}
        </Line>
        {this.renderEditDelegation()}
        {loader ? <SplashLoader light /> : null}
      </Root>
    );
  }

  renderEditDelegation() {
    const { data } = this.props;
    const { id, amount } = data;
    const { edit } = this.state;

    if (edit) {
      const { myAccount, delegationData, globalProps } = this.props;
      const { startEditDelegationGrow } = this.state;

      const { golos } = getVesting(myAccount, globalProps);

      const availableBalance = Math.max(
        0,
        Math.round((parseFloat(golos) - MIN_VOICE_POWER) * 1000)
      );

      const value = Math.round(Math.abs(parseFloat(amount)) * 1000);

      const data = delegationData.find(data => data.id === id);

      return (
        <EditDelegationBlock style={{ height: startEditDelegationGrow ? 118 : 0 }}>
          <EditGolosPower
            value={value}
            max={availableBalance + value}
            onSave={value => this.onDelegationSaveClick(data, value)}
            onCancel={this.onDelegationEditCancelClick}
          />
        </EditDelegationBlock>
      );
    }
  }

  renderDelegationActions() {
    const { loader } = this.state;

    return (
      <Actions>
        <ActionIcon
          color="#3684ff"
          name="pen"
          data-tooltip={tt('user_wallet.content.tip.edit_delegation')}
          onClick={loader ? null : () => this.onEditDelegationClick()}
        />
        <ActionIcon
          color="#fc544e"
          name="round-cross"
          data-tooltip={tt('user_wallet.content.tip.cancel_delegation')}
          onClick={loader ? null : () => this.onCancelDelegationClick()}
        />
      </Actions>
    );
  }

  onEditDelegationClick = () => {
    const { edit, startEditDelegationGrow } = this.state;

    if (edit && startEditDelegationGrow) {
      this.setState({
        startEditDelegationGrow: false,
      });
    } else {
      this.setState(
        {
          edit: true,
          startEditDelegationGrow: false,
        },
        () => {
          setTimeout(() => {
            this.setState({
              startEditDelegationGrow: true,
            });
          }, 50);
        }
      );
    }
  };

  onDelegationEditCancelClick = () => {
    this.setState(
      {
        startEditDelegationGrow: false,
      },
      () => {
        this._resetTimeout = setTimeout(() => {
          this.setState({
            edit: false,
          });
        }, 150);
      }
    );
  };

  onDelegationSaveClick = (item, value) => {
    const { loader } = this.state;

    if (loader) {
      return;
    }

    this.updateDelegation(item, value);
  };

  onCancelDelegationClick = async () => {
    if (await DialogManager.dangerConfirm()) {
      const { data } = this.props;

      const delegationData = this.props.delegationData.find(d => d.id === data.id);

      this.updateDelegation(delegationData, 0);
    }
  };

  updateDelegation({ id, delegatee }, value) {
    const { myAccountName, globalProps } = this.props;

    const vesting = value > 0 ? golosToVests(value / 1000, globalProps) : '0.000000';

    const operation = {
      delegator: myAccountName,
      delegatee,
      vesting_shares: `${vesting} GESTS`,
    };

    this.setState({
      loader: true,
    });

    this.props.delegate(operation, err => {
      if (err) {
        this.setState({
          loader: false,
        });

        if (err !== 'Canceled') {
          DialogManager.alert(err.toString());
        }
      } else {
        this.setState({
          loader: false,
          edit: false,
        });

        this.props.onLoadDelegationsData();
      }
    });
  }
}
