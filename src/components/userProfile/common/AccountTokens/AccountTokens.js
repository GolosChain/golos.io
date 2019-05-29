import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import CollapsingBlock from 'components/golos-ui/CollapsingBlock';
import PieChart from 'components/common/PieChart';

const Root = styled.div``;

const ChartBlock = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
  border-bottom: 1px solid #e9e9e9;
`;

const ChartWrapper = styled.div`
  width: 170px;
  height: 170px;
`;

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

export default class AccountTokens extends PureComponent {
  static propTypes = {
    golos: PropTypes.number.isRequired,
    power: PropTypes.number.isRequired,
    powerDelegated: PropTypes.number.isRequired,
  };

  state = {
    hoverIndex: null,
    // collapsed: false,
  };

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
    const { golos, power, powerDelegated } = this.props;

    const { hoverIndex } = this.state;

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
    ];

    for (const label of labels) {
      let sum = 0;

      for (const { value } of label.values) {
        sum += value;
      }

      label.value = sum.toFixed(3);
    }

    return (
      <Root>
        {golos || power || powerDelegated ? (
          <ChartBlock>
            <ChartWrapper>
              <PieChart
                parts={labels.map((label, i) => ({
                  isBig: i === hoverIndex,
                  value: parseFloat(label.value) / (label.rate || 1),
                  color: label.color,
                }))}
              />
            </ChartWrapper>
          </ChartBlock>
        ) : null}
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
                  <LabelValue>{label.value}</LabelValue>
                </Label>
              )}
            >
              <LabelBody>
                {label.values.map((subLabel, index) => (
                  // eslint-disable-next-line
                  <SubLabel key={index}>
                    <SubColorMark style={{ backgroundColor: label.color }} />
                    <LabelTitle>{subLabel.title}</LabelTitle>
                    <LabelValue>{subLabel.value}</LabelValue>
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
