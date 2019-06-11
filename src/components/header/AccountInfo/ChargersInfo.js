import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { isEmpty, isNil } from 'ramda';

const Wrapper = styled.div`
  padding: 12px 24px;

  border-radius: 6px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);

  animation: fade-in 0.15s;
`;

const Title = styled.div`
  margin: 10px 0;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  height: 38px;
`;

const Label = styled.div`
  flex-grow: 1;
  margin-right: 38px;
  line-height: 1.2em;
`;

const Percent = styled.span``;

const ChargersInfo = ({ className, chargers }) => {
  if (isNil(chargers) || isEmpty(chargers)) {
    return null;
  }

  return (
    <Wrapper className={className}>
      <Title>{tt('header.voice_power')}</Title>
      {Object.keys(chargers).map(ch => (
        <Line key={ch}>
          <Label>{tt(`header.chargers.${ch}`)}</Label>
          <Percent>{chargers[ch]}%</Percent>
        </Line>
      ))}
    </Wrapper>
  );
};

ChargersInfo.propTypes = {
  chargers: PropTypes.shape({
    votes: PropTypes.number,
    posts: PropTypes.number,
    comments: PropTypes.number,
    postbw: PropTypes.number,
  }).isRequired,
};

export default ChargersInfo;
