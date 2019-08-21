import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';

const WhoLink = styled.a`
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CONTRACTS_NAMES = [
  'gls.ctrl',
  'cyber',
  'cyber.msig',
  'cyber.stake',
  'cyber.token',
  'cyber.domain',
  'gls.emit',
  'gls.publish',
  'gls.social',
  'gls.vesting',
];

export default function TransferLink({ user }) {
  if (CONTRACTS_NAMES.includes(user)) {
    return <WhoLink as="span">{user}</WhoLink>;
  }

  return (
    <Link href={`/@${user}`} passHref>
      <WhoLink>@{user}</WhoLink>
    </Link>
  );
}

TransferLink.propTypes = {
  user: PropTypes.string.isRequired,
};
