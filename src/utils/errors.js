/* eslint-disable import/prefer-default-export */
import tt from 'counterpart';

export function normalizeCyberwayErrorMessage(err) {
  if (!err || !err.message) {
    return 'Internal Error';
  }

  let { message } = err;

  // if error from bc
  const providebwMessage = err?.error?.details?.[0]?.message;
  if (providebwMessage) {
    message = providebwMessage;
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
