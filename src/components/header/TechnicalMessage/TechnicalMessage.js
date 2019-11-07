import React from 'react';
import Interpolate from 'react-interpolate-component';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { CONTAINER_FULL_WIDTH } from 'constants/container';

const TechnicalWork = styled.div`
  display: flex;
  flex-direction: column;
  background: #2196f3;
  color: white;
`;

const TechnicalContainerWrapper = styled.div`
  width: 100%;
  max-width: ${CONTAINER_FULL_WIDTH}px;
  margin: 10px auto;

  & a {
    color: #001f33 !important;
  }

  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    width: 100%;
    margin: 10px;
  }

  ${is('center')`
    justify-content: center;
  `}
`;

export default function() {
  return (
    <TechnicalWork>
      <TechnicalContainerWrapper>
        {tt('technical_work.dears')}
        <br />
        {/*{tt('technical_work.text_pause')}*/}
        <Interpolate
          with={{
            channel: <a href="https://t.me/golos_developers">{tt('technical_work.channel')}</a>,
            tasks: (
              <a href="https://github.com/GolosChain/golos.io/issues/new">
                {tt('technical_work.tasks')}
              </a>
            ),
          }}
        >
          {tt('technical_work.want', {
            interpolate: false,
          })}
        </Interpolate>
        <br />
        {tt('technical_work.bless')}
      </TechnicalContainerWrapper>
    </TechnicalWork>
  );
}
