/* eslint-disable import/prefer-default-export */
import tt from 'counterpart';

export function normalizeCyberwayErrorMessage(err) {
  if (!err || !err.message) {
    return 'Internal Error';
  }

  let { message } = err;

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

    if (message.includes('incorrect proxy levels: grantor 1, agent 1')) {
      return tt('chain_errors.incorrect_delegate_proxy_level');
    }

    return match[1].trim();
  }

  return message;
}
