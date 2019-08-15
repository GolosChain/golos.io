import React, { PureComponent } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import { Link } from 'shared/routes';
import WitnessHeader from 'components/witness/WitnessHeader';

export const lineTemplate = '270px minmax(360px, auto)';

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

const REFRESH_INTERVAL = 60 * 1000;

export default class ValidatorsPage extends PureComponent {
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
    try {
      const response = await fetch(
        `${process.env.CYBERWAY_HTTP_URL}/v1/chain/get_producer_schedule`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      const producers = data.active.producers.map(producer => ({
        id: producer.producer_name,
        signKey: producer.block_signing_key,
      }));

      this.setState({
        producers,
        producersUpdateTime: new Date(),
      });
    } catch (err) {
      console.error('Get producers error:', err);
    }
  }

  render() {
    const { producers, producersUpdateTime } = this.state;

    return (
      <WrapperForBackground>
        <Wrapper>
          <WitnessHeader
            title={tt('validators_jsx.validators')}
            subTitle={
              <div>
                {tt('validators_jsx.last_update')} {new Date(producersUpdateTime).toLocaleString()}
              </div>
            }
          />
          <TableWrapper>
            <TableHead>
              <TableHeadItem>{tt('validators_jsx.validator')}</TableHeadItem>
              <TableHeadItem>{tt('validators_jsx.public_key')}</TableHeadItem>
              <TableHeadItem />
            </TableHead>
            {producers.map((producer, index) => (
              <WrapperLine collapsed>
                <WitnessNumberAndName>
                  <div>{index}</div>
                  <Link route="profile" params={{ userId: producer.id }}>
                    <a>{producer.id || 'hello'}</a>
                  </Link>
                </WitnessNumberAndName>
                <WitnessInfoCeil>{producer.signKey}</WitnessInfoCeil>
              </WrapperLine>
            ))}
          </TableWrapper>
        </Wrapper>
      </WrapperForBackground>
    );
  }
}
