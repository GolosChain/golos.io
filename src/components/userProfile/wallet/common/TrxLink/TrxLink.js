import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';

const Trx = styled.a`
  display: flex;
  padding: 4px 2px;
  line-height: 6px;
  border-radius: 4px;
  font-size: 9px;
  border: 1px solid #959595;
  color: #959595;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease 0s, color 0.3s ease 0s;

  &:hover,
  &:focus {
    border-color: #2f2f2f;
    color: #2f2f2f;
  }
`;

export default function TrxLink({ trxId }) {
  if (!trxId) {
    return <Trx as="div">GENESIS</Trx>;
  }

  return (
    <Link href={`${process.env.EXPLORER_URL}/trx/${trxId}`} passHref>
      <Trx target="_blank" rel="noopener nofollow">
        TRX
      </Trx>
    </Link>
  );
}

TrxLink.propTypes = {
  trxId: PropTypes.string.isRequired,
};
