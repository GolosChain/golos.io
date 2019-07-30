import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { defaults, parsePercent, parsePercentString } from 'utils/common';
import { Input } from 'components/golos-ui/Form';
import Button from 'components/golos-ui/Button';

import ErrorLine from '../../ErrorLine';

const DEFAULT = {
  pools: [
    {
      name: '',
      percent: 0,
    },
  ],
};

const Pool = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const PoolFieldTitle = styled.span`
  margin-right: 8px;
  font-size: 14px;
`;

const Fields = styled.label`
  text-transform: none;
`;

const FieldSubTitle = styled.h3`
  display: block;
  margin-top: 4px;
  font-size: 15px;
  font-weight: normal;
`;

const InputSmall = styled(Input)`
  width: 130px;
  padding: 9px 8px;
  margin-right: 10px;
`;

const PercentInput = styled(Input)`
  width: 50px;
  padding: 9px 8px;
  margin-right: 10px;
  text-align: right;
`;

export default class RewardsPool extends PureComponent {
  constructor(props) {
    super(props);

    const { pools } = defaults(props.initialValues, DEFAULT);

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

    const pools = [];

    for (const pool of this.state.pools) {
      const name = pool.name.trim();
      const percent = parsePercentString(pool.percent);

      if (!name || !percent || Number.isNaN(percent)) {
        this.setState({ isInvalid: true });
        onChange('INVALID');
        return;
      }

      pools.push({
        name,
        percent,
      });
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

    this.setState(
      {
        pools: pools.filter((_, i) => i !== index),
      },
      this.triggerChange
    );
  };

  renderPool = ({ name, percent }, index) => {
    const { pools } = this.state;

    return (
      <Pool key={index}>
        <PoolFieldTitle>Пул #{index + 1} Аккаунт:</PoolFieldTitle>
        <InputSmall value={name} onChange={e => this.onFieldChange(e, index, 'name')} />
        <PoolFieldTitle>Процент (%):</PoolFieldTitle>
        <PercentInput value={percent} onChange={e => this.onFieldChange(e, index, 'percent')} />
        {pools.length > 1 ? <Button onClick={() => this.onRemovePoolClick(index)}>X</Button> : null}
      </Pool>
    );
  };

  render() {
    const { pools, isInvalid } = this.state;

    return (
      <Fields>
        <FieldSubTitle>Список пулов:</FieldSubTitle>
        {pools.map(this.renderPool)}
        <Button onClick={this.onAddPoolClick}>Add pool</Button>
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
