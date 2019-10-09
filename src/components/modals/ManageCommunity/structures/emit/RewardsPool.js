import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { parsePercent, parsePercentString } from 'utils/common';
import { Input } from 'components/golos-ui/Form';
import Button from 'components/golos-ui/Button';

import { Fields, FieldSubTitle, ErrorLine } from '../elements';

const Pool = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const PoolFieldTitle = styled.span`
  margin-right: 8px;
  font-size: 14px;
`;

const FieldHint = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  font-style: italic;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding: 9px 8px;
  margin-right: 10px;
`;

const PercentInput = styled(Input)`
  width: 60px;
  padding: 9px 8px;
  margin-right: 10px;
  text-align: right;
`;

export default class RewardsPool extends PureComponent {
  constructor(props) {
    super(props);

    const pools = [];
    const already = {};

    for (const pool of (props.initialValues.pools || []).concat(props.defaults.pools)) {
      if (!already[pool.name]) {
        already[pool.name] = true;
        pools.push(pool);
      }
    }

    const formattedPools = pools.map(pool => ({
      name: pool.name,
      percent: parsePercent(pool.percent),
    }));

    this.state = {
      pools: formattedPools,
    };
  }

  triggerChange = () => {
    const { onChange } = this.props;

    let sum = 0;

    const pools = this.state.pools.map((pool, i) => {
      const isFirst = i === 0;

      const name = pool.name.trim();
      const percent = parsePercentString(pool.percent);

      if (!name) {
        this.setState({ isInvalid: true });
        onChange('INVALID');
        return;
      }

      if (!isFirst) {
        if (!percent || Number.isNaN(percent)) {
          this.setState({ isInvalid: true });
          onChange('INVALID');
          return;
        }

        sum += Number(percent);
      }

      return {
        name,
        percent,
      };
    });

    if (sum > 10000) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      pools,
    });
  };

  onAddPoolClick = () => {
    this.setState(
      {
        pools: this.state.pools.concat({ name: '', percent: 0 }),
      },
      this.triggerChange
    );
  };

  onFieldChange = (e, index, fieldName) => {
    const { pools } = this.state;

    this.setState(
      {
        pools: pools.map((pool, i) => {
          if (i === index) {
            return {
              ...pool,
              [fieldName]: e.target.value,
            };
          }

          return pool;
        }),
      },
      this.triggerChange
    );
  };

  onRemovePoolClick = index => {
    const { pools } = this.state;

    const updatedPools = pools.filter((_, i) => i !== index);

    if (index === 0) {
      updatedPools[0].percent = 0;
    }

    this.setState(
      {
        pools: updatedPools,
      },
      this.triggerChange
    );
  };

  renderPool = ({ name, percent }, index) => {
    const { pools } = this.state;

    let disabled = false;
    let value = percent;

    if (index === 0) {
      disabled = true;

      let rest = 100;

      for (let i = 1; i < pools.length; i++) {
        rest -= parseFloat(pools[i].percent) || 0;
      }

      if (rest < 0) {
        reset = 0;
      }

      value = rest.toFixed(2);
    }

    return (
      <Pool key={index}>
        <PoolFieldTitle>Пул #{index + 1} Аккаунт:</PoolFieldTitle>
        <InputSmall value={name} onChange={e => this.onFieldChange(e, index, 'name')} />
        <PoolFieldTitle>Процент (%):</PoolFieldTitle>
        <PercentInput
          type="number"
          value={value}
          disabled={disabled}
          onChange={e => this.onFieldChange(e, index, 'percent')}
        />
        {pools.length > 1 ? <Button onClick={() => this.onRemovePoolClick(index)}>X</Button> : null}
      </Pool>
    );
  };

  render() {
    const { pools, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Список пулов:</FieldSubTitle>
        <FieldHint>(Значение первого пула всегда вычисляется как остаток до 100%)</FieldHint>
        {pools.map(this.renderPool)}
        <Button onClick={this.onAddPoolClick}>Add pool</Button>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
