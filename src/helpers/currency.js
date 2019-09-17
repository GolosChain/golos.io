import React from 'react';
import tt from 'counterpart';
// import { getHistoricalData } from 'app/redux/actions/rates';
import { CURRENCIES, DEFAULT_CURRENCY } from 'constants/config';

function getStoreState() {
  throw new Error('MOCK');
}
function dispatch() {
  throw new Error('MOCK');
}

const CURRENCY_SIGNS = {
  USD: '$_',
  EUR: '€_',
  RUB: '_₽',
};

const queried = new Set();

export function parseAmount(amount, { balance, isFinal, decs = 3, multiplier = 1, round = false }) {
  const amountFixed = amount.trim().replace(/\s+/, '');
  let error;
  let amountValue = parseFloat(amountFixed) * multiplier;

  if (round) {
    amountValue = Math.round(amountValue);
  }

  const match = amountFixed.match(/\.(\d+)/);

  if (match && match[1].length > decs) {
    error = tt('currency.errors.three_rounding', { decs });
  } else if (!/^\d*(?:\.\d*)?$/.test(amountFixed)) {
    error = tt('currency.errors.wrong_format');
  } else if (amountValue && amountValue > balance) {
    error = tt('currency.errors.insufficient_funds');
  } else if (isFinal && amountFixed !== '' && amountValue === 0) {
    error = tt('currency.errors.enter_amount');
  }

  return {
    error,
    value: error ? null : amountValue,
  };
}

export function formatCurrency(amount, currency, decimals, allowZero) {
  let amountString;

  amount = parseFloat(amount);

  if (!amount) {
    amountString = '0';
  } else if (decimals === 'short') {
    let value;
    let suffix = '';

    if (amount > 1000000000) {
      value = amount / 1000000000;
      suffix = 'B';
    } else if (amount > 1000000) {
      value = amount / 1000000;
      suffix = 'M';
    } else if (amount > 1000) {
      value = amount / 1000;
      suffix = 'K';
    } else {
      value = amount;
    }

    amountString = `${value.toFixed(value > 100 ? 0 : 1)}${suffix}`;
  } else {
    let decimalsCount;

    if (decimals === 'adaptive') {
      if (amount < 10 && !CURRENCY_SIGNS[currency]) {
        decimalsCount = 3;
      } else if (amount < 100) {
        decimalsCount = 2;
      } else if (amount < 1000) {
        decimalsCount = 1;
      } else {
        decimalsCount = 0;
      }
    } else if (decimals) {
      decimalsCount = decimals;
    } else {
      decimalsCount = CURRENCY_SIGNS[currency] ? 2 : 3;
    }

    amountString = amount.toFixed(decimalsCount);

    if (allowZero && /^0\.0+$/.test(amountString)) {
      amountString = '0';
    }
  }

  if (CURRENCY_SIGNS[currency]) {
    return CURRENCY_SIGNS[currency].replace('_', amountString);
  }
  return `${amountString} ${currency}`;
}

function getHistoricalRates(rates, date) {
  // date can be 1970-01-01 or 1969-12-31 (we must skip that dates)
  if (date.startsWith('2')) {
    // 2018-09-10T07:38:57 => 2018-09-10
    const dateString = date.substr(0, 10);

    const ratesInfo = rates.dates.get(dateString);

    if (!ratesInfo) {
      // TODO: TEMP SOLUTION, REMOVE IF AND SET LATER
      if (!queried.has(dateString)) {
        queried.add(dateString);
        dispatch(getHistoricalData(dateString));
      }
      return;
    }

    return ratesInfo;
  }
}

export function renderValue(
  amount,
  originalCurrency,
  { decimals, date, toCurrency, rates, settings, allowZero } = {}
) {
  if (!process.browser) {
    if (typeof amount === 'string') {
      return amount;
    }
    let amountString = amount.toFixed(3);

    if (allowZero && amountString === '0.000') {
      amountString = '0';
    }

    return `${amountString} ${originalCurrency}`;
  }

  if (typeof amount === 'string') {
    const parsed = amount.match(/^([\d.]+) (\w+)$/);

    if (!parsed) {
      return 'Invalid value';
    }

    amount = parseFloat(parsed[1]);

    if (CURRENCIES.includes(parsed[2])) {
      originalCurrency = parsed[2];
    }
  }

  if (!CURRENCIES.includes(originalCurrency)) {
    return 'Invalid value';
  }

  let rate;
  let currency =
    toCurrency ||
    (settings || getStoreState().data.settings).getIn(['basic', 'currency']) ||
    DEFAULT_CURRENCY;

  if (currency !== originalCurrency) {
    const useRates = rates || getStoreState().data.rates;

    if (date) {
      const ratesInfo = getHistoricalRates(useRates, date);

      if (ratesInfo) {
        rate = ratesInfo[originalCurrency][currency];
      }
    }

    if (!rate) {
      rate = useRates.actual[originalCurrency][currency];
    }
  }

  if (!rate) {
    currency = originalCurrency;
    rate = 1;
  }

  if (decimals == null) {
    decimals = (settings || getStoreState().data.settings).getIn(['basic', 'rounding'], 3);
  }

  return formatCurrency(amount * rate, currency, decimals, allowZero);
}
