import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError } from 'utils/toastMessages';
import { overflowEllipsis } from 'utils/styles';
import CollapsingBlock from 'components/golos-ui/CollapsingBlock';
import LoadingIndicator from 'components/elements/LoadingIndicator';
// import PieChart from 'components/common/PieChart';

const Root = styled.div``;

// const ChartBlock = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: 20px 0;
//   border-bottom: 1px solid #e9e9e9;
// `;
//
// const ChartWrapper = styled.div`
//   width: 170px;
//   height: 170px;
// `;

const Labels = styled.div``;

const CollapsingBlockStyled = styled(CollapsingBlock)`
  border-bottom: 1px solid #e9e9e9;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  display: flex;
  height: 52px;
  box-sizing: content-box;
  align-items: center;
`;

const ColorMark = styled.div`
  width: 14px;
  height: 14px;
  margin-right: 12px;
  border-radius: 2px;
  flex-shrink: 0;
`;

const SubColorMark = styled(ColorMark)`
  width: 8px;
  height: 8px;
  margin-left: 4px;
  margin-right: 15px;
  border-radius: 50%;
`;

const LabelTitle = styled.div`
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  text-overflow: ellipsis;
`;

const LabelValue = styled.div`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.7px;
  max-width: 90px;
  ${overflowEllipsis};
`;

const LabelBody = styled.div`
  padding: 0 20px 10px;
`;

const SubLabel = styled.div`
  display: flex;
  height: 30px;
  box-sizing: content-box;
  align-items: center;
  margin-right: 24px;

  ${LabelTitle} {
    font-size: 13px;
  }

  ${LabelValue} {
    font-size: 13px;
    font-weight: 500;
  }
`;

const Loader = styled(LoadingIndicator).attrs({ type: 'circle', center: true, size: 50 })`
  margin-bottom: 10px;
`;

export default class AccountTokens extends PureComponent {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    golos: PropTypes.number.isRequired,
    cyber: PropTypes.number.isRequired,
    power: PropTypes.number.isRequired,
    powerDelegated: PropTypes.number.isRequired,
    unclaimed: PropTypes.number.isRequired,
    cyberStake: PropTypes.shape({
      staked: PropTypes.number.isRequired,
      received: PropTypes.number.isRequired,
      provided: PropTypes.number.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool,
    getBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoading: false,
  };

  state = {
    hoverIndex: null,
    isAlreadyTryToLoad: false,
    // collapsed: false,
  };

  async componentDidMount() {
    const { getBalance, userId } = this.props;

    try {
      await getBalance(userId);
      this.setState({
        isAlreadyTryToLoad: true,
      });
    } catch (err) {
      displayError('Cannot load user balance', err);
    }
  }

  onHover = idx => {
    this.setState({
      hoverIndex: idx,
    });
  };

  onHoverOut = idx => {
    const { hoverIndex } = this.state;
    if (hoverIndex === idx) {
      this.setState({
        hoverIndex: null,
      });
    }
  };

  render() {
    const { golos, cyber, power, powerDelegated, unclaimed, cyberStake, isLoading } = this.props;
    const { isAlreadyTryToLoad } = this.state;

    // const { hoverIndex } = this.state;

    const labels = [
      {
        id: 'golos',
        title: tt('token_names.LIQUID_TOKEN'),
        color: '#2879ff',
        values: [
          {
            title: tt('user_profile.account_tokens.tokens.wallet'),
            value: golos,
          },
        ],
      },
      {
        id: 'power',
        title: tt('token_names.VESTING_TOKEN'),
        color: '#78c2d0',
        values: [
          {
            title: tt('user_profile.account_tokens.tokens.wallet'),
            value: power,
          },
          {
            title: tt('user_profile.account_tokens.tokens.delegated'),
            value: powerDelegated,
          },
        ],
      },
      {
        id: 'cyber',
        title: 'CYBER',
        color: 'rgb(255, 184, 57)',
        values: [
          {
            title: tt('user_profile.account_tokens.tokens.wallet'),
            value: cyber,
          },
        ],
      },
      {
        id: 'cyberStake',
        title: 'CYBER STAKE',
        color: 'rgb(255, 184, 57)',
        values: [
          {
            title: tt('user_profile.account_tokens.tokens.staked'),
            value: cyberStake.staked,
          },
          {
            title: tt('user_profile.account_tokens.tokens.received'),
            value: cyberStake.received,
          },
          {
            title: tt('user_profile.account_tokens.tokens.provided'),
            value: cyberStake.provided,
          },
        ],
      },
      {
        id: 'unclaimed',
        title: tt('user_profile.account_tokens.tokens.unclaimed'),
        color: '#3366ff',
        values: [
          {
            title: tt('token_names.LIQUID_TOKEN'),
            value: unclaimed,
          },
        ],
      },
    ];

    for (const label of labels) {
      let sum = 0;

      for (const { value } of label.values) {
        sum += value;
      }

      label.value = sum.toFixed(3);
    }

    if (isLoading || !isAlreadyTryToLoad) {
      return <Loader />;
    }

    return (
      <Root>
        {/*TODO: we can't sum this */}
        {/*{golos || power || powerDelegated ? (*/}
        {/*  <ChartBlock>*/}
        {/*    <ChartWrapper>*/}
        {/*      <PieChart*/}
        {/*        parts={labels.map((label, i) => ({*/}
        {/*          isBig: i === hoverIndex,*/}
        {/*          value: parseFloat(label.value) / (label.rate || 1),*/}
        {/*          color: label.color,*/}
        {/*        }))}*/}
        {/*      />*/}
        {/*    </ChartWrapper>*/}
        {/*  </ChartBlock>*/}
        {/*) : null}*/}
        <Labels>
          {labels.map((label, i) => (
            <CollapsingBlockStyled
              key={label.id}
              initialCollapsed
              saveStateKey={`tokens_${label.id}`}
              onMouseEnter={() => this.onHover(i)}
              onMouseLeave={() => this.onHoverOut(i)}
              title={() => (
                <Label>
                  <ColorMark style={{ backgroundColor: label.color }} />
                  <LabelTitle>{label.title}</LabelTitle>
                  <LabelValue title={label.value}>{label.value}</LabelValue>
                </Label>
              )}
            >
              <LabelBody>
                {label.values.map((subLabel, index) => (
                  // eslint-disable-next-line
                  <SubLabel key={index}>
                    <SubColorMark style={{ backgroundColor: label.color }} />
                    <LabelTitle>{subLabel.title}</LabelTitle>
                    <LabelValue title={label.value}>{subLabel.value}</LabelValue>
                  </SubLabel>
                ))}
              </LabelBody>
            </CollapsingBlockStyled>
          ))}
        </Labels>
      </Root>
    );
  }
}
