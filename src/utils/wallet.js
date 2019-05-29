import BigNum from 'bignumber.js';

// eslint-disable-next-line
export function calculateAmount({ amount, decs }) {
  if (!decs) {
    debugger;
  }
  return new BigNum(amount).shiftedBy(-decs).toString();
}
