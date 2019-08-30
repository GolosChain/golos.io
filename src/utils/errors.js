/* eslint-disable import/prefer-default-export */
import tt from 'counterpart';

export function normalizeCyberwayErrorMessage(err) {
  if (!err || !err.message || !err.data) {
    return 'Internal Error';
  }

  let { message } = err;

  // if error from bc
  if (err.data) {
    message = err.data.error?.details?.[0]?.message || 'Blockchain Error';
  }

  message = message.replace(/\n/g, ' ').trim();

  const match = message.match(/^assertion failure with message: (.+)$/);
  if (match) {
    message = match[1].trim();

    if (message.includes("Message doesn't exist in cashout window")) {
      return tt('chain_errors.cashout_window');
    }

    return match[1].trim();
  }

  return message;
}
